import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
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

const ServicerecordsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [], setError);
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
            invoiceId: _entity?.invoiceId,serviceId: _entity?.serviceId,vehicleId: _entity?.vehicleId,technicianId: _entity?.technicianId,serviceDate: _entity?.serviceDate,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("servicerecords").create(_data);
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Service Records created successfully" });
        props.onCreateResult(result);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Service Records" });
        }
        setLoading(false);
    };

    

    

    

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

    

    return (
        <Dialog header="Create Service Records" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="servicerecords-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="invoiceId">InvoiceID:</label>
                <InputNumber id="invoiceId" className="w-full mb-3 p-inputtext-sm" value={_entity?.invoiceId} onChange={(e) => setValByKey("invoiceId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["invoiceId"]) ? (
              <p className="m-0" key="error-invoiceId">
                {error["invoiceId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="serviceId">ServiceID:</label>
                <InputNumber id="serviceId" className="w-full mb-3 p-inputtext-sm" value={_entity?.serviceId} onChange={(e) => setValByKey("serviceId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serviceId"]) ? (
              <p className="m-0" key="error-serviceId">
                {error["serviceId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="vehicleId">VehicleID:</label>
                <InputNumber id="vehicleId" className="w-full mb-3 p-inputtext-sm" value={_entity?.vehicleId} onChange={(e) => setValByKey("vehicleId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["vehicleId"]) ? (
              <p className="m-0" key="error-vehicleId">
                {error["vehicleId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="technicianId">TechnicianID:</label>
                <InputNumber id="technicianId" className="w-full mb-3 p-inputtext-sm" value={_entity?.technicianId} onChange={(e) => setValByKey("technicianId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["technicianId"]) ? (
              <p className="m-0" key="error-technicianId">
                {error["technicianId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="serviceDate">ServiceDate:</label>
                <InputNumber id="serviceDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.serviceDate} onChange={(e) => setValByKey("serviceDate", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serviceDate"]) ? (
              <p className="m-0" key="error-serviceDate">
                {error["serviceDate"]}
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

export default connect(mapState, mapDispatch)(ServicerecordsCreateDialogComponent);
