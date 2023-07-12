import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FormControl, FormLabel } from '@mui/material';

export default function RolesAutocomplete({value, setValue}: any) {
    return (
        <FormControl sx={{width: "100%"}}>
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
];
