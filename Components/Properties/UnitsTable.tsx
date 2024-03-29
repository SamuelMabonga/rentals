import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import fetchPropertyUnits from 'apis/property/fetchPropertyUnits';
import { CollectionsContext } from 'context/context';
import ViewUnit from './Common/ViewUnit';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    property: string;
}

type Item = {
    image: string;
    name: string;
    type: string;
    status: string;
    tenant: string;
    dateCreated: string;
    actions: any;
}

const statusOptions = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Occupied", value: "OCCUPIED" },
]

export const UnitsTable = <T extends object>({ property }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        setOpenBookingForm,
        setUnitToBook,
        setOpenUnitForm,
        setUnitToEdit,
        unitsPage: page,
        setUnitsPage: setPage,
        unitSearchQuery: searchQuery,
        setUnitSearchQuery: setSearchQuery,
        unitStatus,
        setUnitStatus,
    }: any = useContext(CollectionsContext)

    const { data, isLoading }: any = useQuery({
        queryKey: ['property-units', property, page, searchQuery, unitStatus],
        queryFn: () => fetchPropertyUnits(property, page, searchQuery, unitStatus),
    })

    const columns: any = [
        {
            header: 'Name',
            cell: (row: any) => row.renderValue(),
            accessorKey: 'name',
        },
        {
            header: 'Unit Type',
            cell: (row: any) => row.renderValue(),
            accessorKey: 'unitType.name',
        },
        {
            header: 'Status',
            cell: (row: any) =>
                <Chip
                    label={row.row.original.status}
                    // color="inherit"
                    size="small"
                    sx={{
                        fontSize: "0.75rem",
                        // color: row.row.original.status === "AVAILABLE" ? "limegreen" : "error.main",
                        bgcolor: row.row.original.status === "AVAILABLE" ? "limegreen" : "error.main",
                        borderColor: row.row.original.status === "AVAILABLE" ? "limegreen" : "error.main",
                        color: "white",
                    }}
                    variant="outlined"
                />,
            accessorKey: 'status',
        },
        {
            header: 'Tenant',
            cell: (row: any) => row?.row?.original?.status === "AVAILABLE" ?
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ fontSize: "0.875rem", lineHeight: "100%", whiteSpace: "nowrap" }}
                    onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()

                        setUnitToBook(row.row.original)
                        setOpenBookingForm(true)
                    }}
                >
                    <Box width="1.5rem" height="1.5rem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                    </Box>
                    Add Tenant
                </Button> :
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ fontSize: "0.875rem", lineHeight: "100%", whiteSpace: "nowrap" }}
                    onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()

                        // setUnitToBook(row.row.original)
                        // setOpenBookingForm(true)
                        setUnitToBook(row.row.original)
                        setOpenBookingForm(true)
                    }}
                >
                    <Box width="1.5rem" height="1.5rem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                    </Box>
                    Book for later
                </Button>
            ,
            accessorKey: 'tenant.user.first_name',
        },
        {
            header: 'Date Created',
            cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
            accessorKey: 'createdAt',
        },
        {
            header: 'Actions',
            cell: (row: any) => (
                <Box display="flex" gap="1rem" >
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            setOpenUnitForm(true)
                            setUnitToEdit(row.row.original)
                        }}
                    >
                        <Box width="1.5rem" height="1.5rem">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </Box>
                    </IconButton>

                    <IconButton>
                        <Box width="1.5rem" height="1.5rem">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </Box>
                    </IconButton>
                </Box>
            ),
        },
    ]

    // VIEW UNIT
    const [viewUnit, setViewUnit] = useState(false);
    const [unit, setUnit] = useState({});

    return (
        <>
            <TableRenderer
                data={data?.data || []}
                pageInfo={data?.pageInfo}
                columns={columns}
                onRowClick={function (obj: any): void {
                    setUnit(obj)
                    setViewUnit(true)
                }}
                loading={isLoading}
                setPage={setPage}

                buttonAction={setOpenUnitForm}
                buttonLabel="Create Unit"

                status={unitStatus}
                setStatus={setUnitStatus}

                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}

                statusOptions={statusOptions}
            />
            <ViewUnit unit={unit} open={viewUnit} setIsOpen={setViewUnit} />
        </>
    );
};