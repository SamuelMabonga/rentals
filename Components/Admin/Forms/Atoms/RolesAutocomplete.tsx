import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FormControl, FormLabel } from '@mui/material';

export default function RolesAutocomplete({ value, setValue }: any) {
    return (
        <FormControl sx={{ width: "100%" }}>
            <FormLabel>Permissions</FormLabel>
            <Autocomplete
                multiple
                limitTags={2}
                id="roles-autocomplete"
                options={permissions}
                getOptionLabel={(option) => option.name}
                //   defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                value={value}
                renderInput={(params) => (
                    <TextField {...params} placeholder="Permissions" />
                )}
                sx={{ width: '100%' }}
                onChange={(e, value) => setValue(value)}
            />
        </FormControl>
    );
}

const permissions = [
    // PROPERTY
    { name: 'Create property' },
    { name: 'Edit Property' },
    { name: 'View Property' },
    { name: 'Deactivate Property' },

    // PROPERTY FEATURES
    { name: 'Create property feature' },
    { name: 'Edit property feature' },
    { name: 'View property feature' },
    { name: 'Delete property feature' },

    // PROPERTY UNIT TYPES
    { name: 'Create unit type' },
    { name: 'Edit unit type' },
    { name: 'View unit type' },
    { name: 'Delete unit type' },

    // PROPERTY UNITS
    { name: 'Create unit' },
    { name: 'Edit unit' },
    { name: 'View unit' },
    { name: 'Delete unit' },

    // BOOKING
    { name: 'Create booking' },
    { name: 'Edit booking' },
    { name: 'View bookings' },
    { name: 'Delete booking' },
    { name: 'Accept booking' },
    { name: 'Reject booking' },

    // PROPERTY TENANTS
    { name: 'Create tenant' },
    { name: 'Edit tenant' },
    { name: 'View tenants' },
    { name: 'Delete tenant' },

    // TENANTS
    { name: 'Create tenant' },
    { name: 'Edit tenant' },
    { name: 'View tenants' },
    { name: 'Delete tenant' },

    // BILLS
    { name: 'Create bill' },
    { name: 'Edit bill' },
    { name: 'View bills' },
    { name: 'Delete bill' },

    // STAFF
    { name: 'Create staff' },
    { name: 'Edit staff' },
    { name: 'View staff' },
    { name: 'Delete staff' },

    // BILL EXTENSION
    { name: 'Create bill extension' },
    { name: 'Edit bill extension' },
    { name: 'View bill extensions' },
    { name: 'Delete bill extension' },
    { name: 'Accept bill extension' },
    { name: 'Reject bill extension' },

    // TENANCY MODIFICATION
    { name: 'Create tenancy modification' },
    { name: 'Edit tenancy modification' },
    { name: 'View tenancy modification' },
    { name: 'Delete tenancy modification' },
    { name: 'Accept tenancy modification' },
    { name: 'Reject tenancy modification' },
];
