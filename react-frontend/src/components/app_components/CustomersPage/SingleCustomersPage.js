import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

import VehiclesPage from "../VehiclesPage/VehiclesPage";
import InvoicesPage from "../InvoicesPage/InvoicesPage";

const SingleCustomersPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    const [firstName, setFirstName] = useState([]);
const [phoneNumber, setPhoneNumber] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("customers")
            .get(urlParams.singleCustomersId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"firstName","phoneNumber"] }})
            .then((res) => {
                set_entity(res || {});
                const firstName = Array.isArray(res.firstName)
            ? res.firstName.map((elem) => ({ _id: elem._id, password: elem.password }))
            : res.firstName
                ? [{ _id: res.firstName._id, password: res.firstName.password }]
                : [];
        setFirstName(firstName);
const phoneNumber = Array.isArray(res.phoneNumber)
            ? res.phoneNumber.map((elem) => ({ _id: elem._id, number: elem.number }))
            : res.phoneNumber
                ? [{ _id: res.phoneNumber._id, number: res.phoneNumber.number }]
                : [];
        setPhoneNumber(phoneNumber);
            })
            .catch((error) => {
                console.debug({ error });
                props.alert({ title: "Customers", type: "error", message: error.message || "Failed get customers" });
            });
    }, [props,urlParams.singleCustomersId]);


    const goBack = () => {
        navigate("/customers");
    };

      const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

    const menuItems = [
        {
            label: "Copy link",
            icon: "pi pi-copy",
            command: () => copyPageLink(),
        },
        {
            label: "Help",
            icon: "pi pi-question-circle",
            command: () => toggleHelpSidebar(),
        },
    ];

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-12">
                <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Customers</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>customers/{urlParams.singleCustomersId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">LastName</label><p className="m-0 ml-3" >{_entity?.lastName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Email</label><p className="m-0 ml-3" >{_entity?.email}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Address</label><p className="m-0 ml-3" >{_entity?.address}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">JoinDate</label><p className="m-0 ml-3" >{Number(_entity?.joinDate)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">LoyaltyPoints</label><p className="m-0 ml-3" >{Number(_entity?.loyaltyPoints)}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">FirstName</label>
                    {firstName.map((elem) => (
                        <Link key={elem._id} to={`/users/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.password}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">PhoneNumber</label>
                    {phoneNumber.map((elem) => (
                        <Link key={elem._id} to={`/userPhones/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.number}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
      </div>
       <div className="mt-2">
            <TabView>
                
                    <TabPanel header="vehicles" leftIcon="pi pi-building-columns mr-2">
                    <VehiclesPage/>
                    </TabPanel>
                    

                    <TabPanel header="invoices" leftIcon="pi pi-building-columns mr-2">
                    <InvoicesPage/>
                    </TabPanel>
                    
            </TabView>
        </div>

      <CommentsSection
        recordId={urlParams.singleCustomersId}
        user={props.user}
        alert={props.alert}
        serviceName="customers"
      />
    <div
        id="rightsidebar"
        className={classNames(
          "overlay-auto z-10 surface-overlay shadow-2 fixed top-0 right-0 w-20rem animation-duration-150 animation-ease-in-out",
          { hidden: !isHelpSidebarVisible, block: isHelpSidebarVisible }
        )}
        style={{
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="flex flex-column h-full p-4 bg-white" style={{ height: "calc(100% - 60px)", marginTop: "60px" }}>
          <span className="text-xl font-medium text-900 mb-3">Help bar</span>
          <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
        </div>
      </div>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleCustomersPage);
