import * as yup from "yup";

export const formSchema = yup.object().shape({
    userSearchTerm: yup.string().required(),
    user: yup.object().when("userSearchTerm", {
        is: (val) => val.length > 2,
        then: () => yup.object().shape({
            _id: yup.string().required("Required"),
            // first_name: yup.string().required("Required"),
            // last_name: yup.string().required("Required")
        }),
    }),
    unitType: yup.object().when("user", {
        is: (val) => val._id,
        then: () => yup.object().shape({
            _id: yup.string().required("Required"),
            name: yup.string().required("Required")
        }),
    }),
    unit: yup.object().when("unitType", {
        is: (val) => val._id,
        then: () => yup.object().shape({
            _id: yup.string().required("Required"),
            name: yup.string().required("Required")
        })
    }),
    additionalFeatures: yup.array().when("unit", {
        is: (val) => val._id,
        then: () => yup.array().of(
            yup.object().shape({
                _id: yup.string().required("Required"),
                feature: yup.object().shape({
                    _id: yup.string().required("Required"),
                    name: yup.string().required("Required")
                }),
            })
        )
    }),
    startDate: yup.string().when("unit", {
        is: (val) => val._id,
        then: () => yup.string().required("Required")
    }),
    endDate: yup.string().when("unit", {
        is: (val) => val._id,
        then: () => yup.string().required("Required")
    })
})

export const formSchema2 = yup.object().shape({
    userSearchTerm: yup.string().required(),
    user: yup.object().shape({
        _id: yup.string().required("Required"),
        name: yup.string().required("Required"),
        // first_name: yup.string().required("Required"),
        // last_name: yup.string().required("Required")
    }),
    additionalFeatures: yup.array().of(
        yup.object().shape({
            _id: yup.string().required("Required"),
            feature: yup.object().shape({
                _id: yup.string().required("Required"),
                name: yup.string().required("Required")
            }),
        })
    ),
    startDate: yup.string().required("Required"),
    endDate: yup.string().required("Required")
})