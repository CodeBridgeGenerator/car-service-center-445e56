import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const CustomersCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [firstName, setFirstName] = useState([])
const [phoneNumber, setPhoneNumber] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [firstName,phoneNumber], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            firstName: _entity?.firstName?._id,lastName: _entity?.lastName,email: _entity?.email,phoneNumber: _entity?.phoneNumber?._id,address: _entity?.address,joinDate: _entity?.joinDate,loyaltyPoints: _entity?.loyaltyPoints,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("customers").create(_data);
        const eagerResult = await client
            .service("customers")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "firstName",
                    service : "users",
                    select:["password"]},{
                    path : "phoneNumber",
                    service : "userPhones",
                    select:["number"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Customers updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Customers" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setFirstName(res.data.map((e) => { return { name: e['password'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

useEffect(() => {
                    // on mount userPhones
                    client
                        .service("userPhones")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUserPhonesId } })
                        .then((res) => {
                            setPhoneNumber(res.data.map((e) => { return { name: e['number'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "UserPhones", type: "error", message: error.message || "Failed get userPhones" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const firstNameOptions = firstName.map((elem) => ({ name: elem.name, value: elem.value }));
const phoneNumberOptions = phoneNumber.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Customers" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="customers-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="firstName">FirstName:</label>
                <Dropdown id="firstName" value={_entity?.firstName?._id} optionLabel="name" optionValue="value" options={firstNameOptions} onChange={(e) => setValByKey("firstName", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["firstName"]) ? (
              <p className="m-0" key="error-firstName">
                {error["firstName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="lastName">LastName:</label>
                <InputText id="lastName" className="w-full mb-3 p-inputtext-sm" value={_entity?.lastName} onChange={(e) => setValByKey("lastName", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["lastName"]) ? (
              <p className="m-0" key="error-lastName">
                {error["lastName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="email">Email:</label>
                <InputText id="email" className="w-full mb-3 p-inputtext-sm" value={_entity?.email} onChange={(e) => setValByKey("email", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["email"]) ? (
              <p className="m-0" key="error-email">
                {error["email"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="phoneNumber">PhoneNumber:</label>
                <Dropdown id="phoneNumber" value={_entity?.phoneNumber?._id} optionLabel="name" optionValue="value" options={phoneNumberOptions} onChange={(e) => setValByKey("phoneNumber", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["phoneNumber"]) ? (
              <p className="m-0" key="error-phoneNumber">
                {error["phoneNumber"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="address">Address:</label>
                <InputText id="address" className="w-full mb-3 p-inputtext-sm" value={_entity?.address} onChange={(e) => setValByKey("address", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["address"]) ? (
              <p className="m-0" key="error-address">
                {error["address"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="joinDate">JoinDate:</label>
                <InputNumber id="joinDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.joinDate} onChange={(e) => setValByKey("joinDate", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["joinDate"]) ? (
              <p className="m-0" key="error-joinDate">
                {error["joinDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="loyaltyPoints">LoyaltyPoints:</label>
                <InputNumber id="loyaltyPoints" className="w-full mb-3 p-inputtext-sm" value={_entity?.loyaltyPoints} onChange={(e) => setValByKey("loyaltyPoints", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["loyaltyPoints"]) ? (
              <p className="m-0" key="error-loyaltyPoints">
                {error["loyaltyPoints"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(CustomersCreateDialogComponent);
