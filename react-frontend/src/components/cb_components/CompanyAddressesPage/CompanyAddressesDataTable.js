import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import UploadService from '../../../services/UploadService';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import DownloadCSV from '../../../utils/DownloadCSV';
import InboxCreateDialogComponent from '../../cb_components/InboxPage/InboxCreateDialogComponent';
import InviteIcon from '../../../assets/media/Invite.png';
import ExportIcon from '../../../assets/media/Export & Share.png';
import CopyIcon from '../../../assets/media/Clipboard.png';
import DuplicateIcon from '../../../assets/media/Duplicate.png';
import DeleteIcon from '../../../assets/media/Trash.png';

const CompanyAddressesDataTable = ({
    items,
    fields,
    onEditRow,
    onRowDelete,
    onRowClick,
    searchDialog,
    setSearchDialog,
    showUpload,
    setShowUpload,
    showFilter,
    setShowFilter,
    showColumns,
    setShowColumns,
    onClickSaveFilteredfields,
    selectedFilterFields,
    setSelectedFilterFields,
    selectedHideFields,
    setSelectedHideFields,
    onClickSaveHiddenfields,
    loading,
    user,
    selectedDelete,
    setSelectedDelete,
    onCreateResult
}) => {
    const dt = useRef(null);
    const urlParams = useParams();
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [data, setData] = useState([]);

    const dropdownTemplate0 = (rowData, { rowIndex }) => <p>{rowData.companyId?.name}</p>;
    const inputTextareaTemplate1 = (rowData, { rowIndex }) => <p>{rowData.Street1}</p>;
    const inputTextareaTemplate2 = (rowData, { rowIndex }) => <p>{rowData.Street2}</p>;
    const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.Poscode}</p>;
    const pTemplate4 = (rowData, { rowIndex }) => <p>{rowData.City}</p>;
    const pTemplate5 = (rowData, { rowIndex }) => <p>{rowData.State}</p>;
    const pTemplate6 = (rowData, { rowIndex }) => <p>{rowData.Province}</p>;
    const pTemplate7 = (rowData, { rowIndex }) => <p>{rowData.Country}</p>;
    const p_booleanTemplate8 = (rowData, { rowIndex }) => <p>{String(rowData.isDefault)}</p>;
    const editTemplate = (rowData, { rowIndex }) => <Button onClick={() => onEditRow(rowData, rowIndex)} icon={`pi ${rowData.isEdit ? 'pi-check' : 'pi-pencil'}`} className={`p-button-rounded p-button-text ${rowData.isEdit ? 'p-button-success' : 'p-button-warning'}`} />;
    const deleteTemplate = (rowData, { rowIndex }) => <Button onClick={() => onRowDelete(rowData._id)} icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" />;

    const checkboxTemplate = (rowData) => (
        <Checkbox
            checked={selectedItems.some((item) => item._id === rowData._id)}
            onChange={(e) => {
                let _selectedItems = [...selectedItems];

                if (e.checked) {
                    _selectedItems.push(rowData);
                } else {
                    _selectedItems = _selectedItems.filter((item) => item._id !== rowData._id);
                }
                setSelectedItems(_selectedItems);
            }}
        />
    );
    const deselectAllRows = () => {
        // Logic to deselect all selected rows
        setSelectedItems([]); // Assuming setSelectedItems is used to manage selected items state
    };

    const handleDelete = async () => {
        if (!selectedItems || selectedItems.length === 0) return;

        try {
            const promises = selectedItems.map((item) => client.service('companies').remove(item._id));
            await Promise.all(promises);
            const updatedData = data.filter((item) => !selectedItems.find((selected) => selected._id === item._id));
            setData(updatedData);
            setSelectedDelete(selectedItems.map((item) => item._id));

            deselectAllRows();
        } catch (error) {
            console.error('Failed to delete selected records', error);
        }
    };

    const handleMessage = () => {
        setShowDialog(true); // Open the dialog
    };

    const handleHideDialog = () => {
        setShowDialog(false); // Close the dialog
    };

    return (
        <>
            <DataTable
                value={items}
                ref={dt}
                removableSort
                onRowClick={onRowClick}
                scrollable
                rowHover
                stripedRows
                paginator
                rows={10}
                rowsPerPageOptions={[10, 50, 250, 500]}
                size={'small'}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowClassName="cursor-pointer"
                alwaysShowPaginator={!urlParams.singleUsersId}
                selection={selectedItems}
                onSelectionChange={(e) => setSelectedItems(e.value)}
                onCreateResult={onCreateResult}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} body={checkboxTemplate} />
                <Column field="companyId" header="Company" body={dropdownTemplate0} filter={selectedFilterFields.includes('companyId')} hidden={selectedHideFields?.includes('companyId')} style={{ minWidth: '8rem' }} />
                <Column field="Street1" header="Street1" body={inputTextareaTemplate1} filter={selectedFilterFields.includes('Street1')} hidden={selectedHideFields?.includes('Street1')} sortable style={{ minWidth: '8rem' }} />
                <Column field="Street2" header="Street2" body={inputTextareaTemplate2} filter={selectedFilterFields.includes('Street2')} hidden={selectedHideFields?.includes('Street2')} sortable style={{ minWidth: '8rem' }} />
                <Column field="Poscode" header="Poscode" body={pTemplate3} filter={selectedFilterFields.includes('Poscode')} hidden={selectedHideFields?.includes('Poscode')} sortable style={{ minWidth: '8rem' }} />
                <Column field="City" header="City" body={pTemplate4} filter={selectedFilterFields.includes('City')} hidden={selectedHideFields?.includes('City')} sortable style={{ minWidth: '8rem' }} />
                <Column field="State" header="State" body={pTemplate5} filter={selectedFilterFields.includes('State')} hidden={selectedHideFields?.includes('State')} sortable style={{ minWidth: '8rem' }} />
                <Column field="Province" header="Province" body={pTemplate6} filter={selectedFilterFields.includes('Province')} hidden={selectedHideFields?.includes('Province')} sortable style={{ minWidth: '8rem' }} />
                <Column field="Country" header="Country" body={pTemplate7} filter={selectedFilterFields.includes('Country')} hidden={selectedHideFields?.includes('Country')} sortable style={{ minWidth: '8rem' }} />
                <Column field="isDefault" header="Is Default" body={p_booleanTemplate8} filter={selectedFilterFields.includes('isDefault')} hidden={selectedHideFields?.includes('isDefault')} style={{ minWidth: '8rem' }} />
                <Column header="Edit" body={editTemplate} />
                <Column header="Delete" body={deleteTemplate} />
            </DataTable>

            {selectedItems.length > 0 ? (
                <div
                    className="card center"
                    style={{
                        width: '51rem',
                        margin: '20px auto 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                        color: '#2A4454'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #2A4454',
                            padding: '5px',
                            borderRadius: '5px'
                        }}
                    >
                        {selectedItems.length} selected
                        <span
                            className="pi pi-times"
                            style={{
                                cursor: 'pointer',
                                marginLeft: '10px',
                                color: '#2A4454'
                            }}
                            onClick={() => {
                                deselectAllRows();
                            }}
                        />
                    </div>

                    {/* New buttons section */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Copy button */}
                        <Button
                            label="Copy"
                            labelposition="right"
                            icon={<img src={CopyIcon} style={{ marginRight: '4px', width: '1em', height: '1em' }} />}
                            // tooltip="Copy"
                            // onClick={handleCopy}
                            className="p-button-rounded p-button-text"
                            style={{
                                backgroundColor: 'white',
                                color: '#2A4454',
                                border: '1px solid transparent',
                                transition: 'border-color 0.3s',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
                                marginRight: '8px',
                                gap: '4px'
                            }}
                        />

                        {/* Duplicate button */}
                        <Button
                            label="Duplicate"
                            labelposition="right"
                            icon={<img src={DuplicateIcon} style={{ marginRight: '4px', width: '1em', height: '1em' }} />}
                            // tooltip="Duplicate"
                            // onClick={handleDuplicate}
                            className="p-button-rounded p-button-text"
                            style={{
                                backgroundColor: 'white',
                                color: '#2A4454',
                                border: '1px solid transparent',
                                transition: 'border-color 0.3s',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
                                marginRight: '8px',
                                gap: '4px'
                            }}
                        />

                        {/* Export button */}
                        <Button
                            label="Export"
                            labelposition="right"
                            icon={<img src={ExportIcon} style={{ marginRight: '4px', width: '1em', height: '1em' }} />}
                            // tooltip="Export"
                            // onClick={handleExport}
                            className="p-button-rounded p-button-text"
                            style={{
                                backgroundColor: 'white',
                                color: '#2A4454',
                                border: '1px solid transparent',
                                transition: 'border-color 0.3s',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
                                marginRight: '8px',
                                gap: '4px'
                            }}
                        />

                        {/* Message button */}
                        <Button
                            label="Message"
                            labelposition="right"
                            icon={<img src={InviteIcon} style={{ marginRight: '4px', width: '1em', height: '1em' }} />}
                            onClick={handleMessage}
                            className="p-button-rounded p-button-text"
                            style={{
                                backgroundColor: 'white',
                                color: '#2A4454',
                                border: '1px solid transparent',
                                transition: 'border-color 0.3s',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
                                marginRight: '8px',
                                gap: '4px'
                            }}
                        />

                        {/* InboxCreateDialogComponent */}
                        <InboxCreateDialogComponent
                            show={showDialog}
                            onHide={handleHideDialog}
                            serviceInbox="companies"
                            onCreateResult={onCreateResult}
                            // selectedItemsId={selectedItems.map(item => item._id)}
                            selectedItemsId={selectedItems}
                        />

                        {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
                        <Button
                            label="Delete"
                            labelposition="right"
                            icon={<img src={DeleteIcon} style={{ marginRight: '4px', width: '1em', height: '1em' }} />}
                            onClick={handleDelete}
                            style={{
                                backgroundColor: 'white',
                                color: '#2A4454',
                                border: '1px solid transparent',
                                transition: 'border-color 0.3s',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
                                gap: '4px'
                            }}
                        />
                    </div>
                </div>
            ) : null}

            <Dialog header="Upload CompanyAddresses Data" visible={showUpload} onHide={() => setShowUpload(false)}>
                <UploadService
                    user={user}
                    serviceName="companyAddresses"
                    onUploadComplete={() => {
                        setShowUpload(false); // Close the dialog after upload
                    }}
                />
            </Dialog>

            <Dialog header="Search CompanyAddresses" visible={searchDialog} onHide={() => setSearchDialog(false)}>
                Search
            </Dialog>
            <Dialog header="Filter Users" visible={showFilter} onHide={() => setShowFilter(false)}>
                <div className="card flex justify-content-center">
                    <MultiSelect value={selectedFilterFields} onChange={(e) => setSelectedFilterFields(e.value)} options={fields} optionLabel="name" optionValue="value" filter placeholder="Select Fields" maxSelectedLabels={6} className="w-full md:w-20rem" />
                </div>
                <Button
                    text
                    label="save as pref"
                    onClick={() => {
                        console.debug(selectedFilterFields);
                        onClickSaveFilteredfields(selectedFilterFields);
                        setSelectedFilterFields(selectedFilterFields);
                        setShowFilter(false);
                    }}
                ></Button>
            </Dialog>

            <Dialog header="Hide Columns" visible={showColumns} onHide={() => setShowColumns(false)}>
                <div className="card flex justify-content-center">
                    <MultiSelect value={selectedHideFields} onChange={(e) => setSelectedHideFields(e.value)} options={fields} optionLabel="name" optionValue="value" filter placeholder="Select Fields" maxSelectedLabels={6} className="w-full md:w-20rem" />
                </div>
                <Button
                    text
                    label="save as pref"
                    onClick={() => {
                        console.debug(selectedHideFields);
                        onClickSaveHiddenfields(selectedHideFields);
                        setSelectedHideFields(selectedHideFields);
                        setShowColumns(false);
                    }}
                ></Button>
            </Dialog>
        </>
    );
};

export default CompanyAddressesDataTable;