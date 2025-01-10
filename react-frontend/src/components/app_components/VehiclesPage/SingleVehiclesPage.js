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

import InvoicesPage from "../InvoicesPage/InvoicesPage";

const SingleVehiclesPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    const [customerId, setCustomerId] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("vehicles")
            .get(urlParams.singleVehiclesId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"customerId"] }})
            .then((res) => {
                set_entity(res || {});
                const customerId = Array.isArray(res.customerId)
            ? res.customerId.map((elem) => ({ _id: elem._id, firstName: elem.firstName }))
            : res.customerId
                ? [{ _id: res.customerId._id, firstName: res.customerId.firstName }]
                : [];
        setCustomerId(customerId);
            })
            .catch((error) => {
                console.debug({ error });
                props.alert({ title: "Vehicles", type: "error", message: error.message || "Failed get vehicles" });
            });
    }, [props,urlParams.singleVehiclesId]);


    const goBack = () => {
        navigate("/vehicles");
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
                    <h3 className="m-0">Vehicles</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>vehicles/{urlParams.singleVehiclesId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Make</label><p className="m-0 ml-3" >{_entity?.make}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Model</label><p className="m-0 ml-3" >{_entity?.model}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Year</label><p className="m-0 ml-3" >{Number(_entity?.year)}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">LicensePlate</label><p className="m-0 ml-3" >{_entity?.licensePlate}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">VIN</label><p className="m-0 ml-3" >{_entity?.vin}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">CustomerID</label>
                    {customerId.map((elem) => (
                        <Link key={elem._id} to={`/customers/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.firstName}</p>
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
                
                    <TabPanel header="invoices" leftIcon="pi pi-building-columns mr-2">
                    <InvoicesPage/>
                    </TabPanel>
                    
            </TabView>
        </div>

      <CommentsSection
        recordId={urlParams.singleVehiclesId}
        user={props.user}
        alert={props.alert}
        serviceName="vehicles"
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

export default connect(mapState, mapDispatch)(SingleVehiclesPage);