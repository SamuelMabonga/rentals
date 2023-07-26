import { useStaticPicker } from "@mui/x-date-pickers/internals"
import {createContext, useState} from "react"

const CollectionsContext = createContext({})

const CollectionsProvider = ({children}: any) => {
    const [collections, setCollections] = useState([])

    const refreshCollections = async () => {
        try {
            // const res = await fetch(`${process.env.HOST}/api/airtable/getProducts`)
            const res = await fetch(`${process.env.HOST}/api/airtable/getCollections`)
            const latestCollections = await res.json()
            setCollections(latestCollections)
        } catch (error: any) {
            console.error(error)
        }
    }

    const [activePropertiesTab, setActivePropertiesTab] = useState("units")

    // SNACKBAR MESSAGE
    const [snackbarMessage, setSnackbarMessage] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      })

    // FORMS
    const [showUnitTypeForm, setShowUnitTypeForm] = useState(false)
    const [unitTypeToEdit, setUnitTypeToEdit] = useState({})
    const [unitTypesPage, setUnitTypesPage] = useState(1)
    
    // PROPERTY FORM
    const [showPropertyForm, setShowPropertyForm] = useState(false)
    const [propertyToEdit, setPropertyToEdit] = useState()
    const [propertiesPage, setPropertiesPage] = useState(1)

    // FEATURE FORM
    const [featuresPage, setFeaturesPage] = useState(1)
    const [openFeaturesForm, setOpenFeaturesForm] = useState(false)
    const [featureToEdit, setFeatureToEdit] = useState()

    // BILLING PERIODS FORM
    const [openBillingPeriodsForm, setOpenBillingPeriodsForm] = useState(false)
    const [billingPeriodToEdit, setBillingPeriodToEdit] = useState({})

    // PROPERTY FEATURES FORM
    const [openPropertyFeaturesForm, setOpenPropertyFeaturesForm] = useState(false)
    const [propertyFeatureToEdit, setPropertyFeatureToEdit] = useState({})
    const [propertyFeaturesPage, setPropertyFeaturesPage] = useState(1)

    // UNIT FORM
    const [openUnitForm, setOpenUnitForm] = useState(false)
    const [unitToEdit, setUnitToEdit] = useState(false)
    const [unitsPage, setUnitsPage] = useState(1)

    // BOOKING FORM
    const [openBookingForm, setOpenBookingForm] = useState(false)
    const [bookingToEdit, setBookingToEdit] = useState({})
    const [unitToBook, setUnitToBook] = useState({})
    const [bookingPage, setBookingPage] = useState(1)


    // IMAGE UPLOADER
    const [openImageUploader, setOpenImageUploader] = useState(false)
    const [imageToUpload, setImageToUpload] = useState("https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg")
    const [inputId, setInputId] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [imageType, setImageType] = useState("")


    // RENTAL
    const [ activeRentalTab, setActiveRentalTab ] = useState("bills")


    // REQUEST EXTENSION
    const [ openRequestExtension, setOpenRequestExtension ] = useState(false)

    // PAYMENT CONFIG
    const [paymentConfig, setPaymentConfig] = useState({
            logo: "",
            tx_ref: "",
            amount: 0,
            title: "",
            description: "",
            currency: "UGX",
            // payment_options: "card,mobilemoneyuganda",
            customer: {
                email: "",
                phonenumber: "",
                name: ""
            },
    })

    // PAYMENT FORM
    const [openPaymentForm, setOpenPaymentForm] = useState(false)


    // LOADING BACKDROP
    const [ openLoadingBackdrop, setOpenLoadingBackdrop] = useState(false)

    // VIEW TENANT
    const [ openViewTenant, setOpenViewTenant ] = useState(false)
    const [tenantsPage, setTenantsPage] = useState(1)

    // TICKET FORM
    const [ openTicketForm, setOpenTicketForm ] = useState(false)
    const [ ticketToEdit, setTicketToEdit ] = useState({})

    // REQUEST TENANCY EXTENSION
    const [ openRequestTenancyExtension, setOpenRequestTenancyExtension ] = useState(false)


    // RENTALS
    const [rentalsPage, setRentalsPage] = useState(1)

    // PUBLIC BOOKING 
    const [openPublicBooking, setOpenPublicBooking] = useState(false)


    // TENANT BILLS
    const [tenantBillsPage, setTenantBillsPage] = useState(1)

    // ROLES
    const [rolesPage, setRolesPage] = useState(1)
    const [roleToEdit, setRoleToEdit] = useState({})
    const [openRolesForm, setOpenRolesForm] = useState(false)

    // STAFF FORM
    const [openStaffForm, setOpenStaffForm] = useState(false)
    const [staffToEdit, setStaffToEdit] = useState({})
    const [staffPage, setStaffPage] = useState(1)

    return (
        <CollectionsContext.Provider value={{
            collections,
            setCollections,
            refreshCollections,

            // PROPERTIES CONTEXT
            activePropertiesTab,
            setActivePropertiesTab,

            // FORMS
            showUnitTypeForm,
            setShowUnitTypeForm,
            unitTypeToEdit,
            setUnitTypeToEdit,
            unitTypesPage,
            setUnitTypesPage,

            // Property form
            showPropertyForm,
            setShowPropertyForm,
            propertyToEdit,
            setPropertyToEdit,
            propertiesPage,
            setPropertiesPage,

            // Features form
            openFeaturesForm,
            setOpenFeaturesForm,
            featureToEdit,
            setFeatureToEdit,
            featuresPage,
            setFeaturesPage,

            // Billing Periods
            openBillingPeriodsForm,
            setOpenBillingPeriodsForm,
            billingPeriodToEdit,
            setBillingPeriodToEdit,


            // Property Features form
            openPropertyFeaturesForm,
            setOpenPropertyFeaturesForm,
            propertyFeatureToEdit,
            setPropertyFeatureToEdit,
            propertyFeaturesPage,
            setPropertyFeaturesPage,

            // Unit Form
            openUnitForm,
            setOpenUnitForm,
            unitToEdit,
            setUnitToEdit,
            unitsPage,
            setUnitsPage,

            // Bookings form
            openBookingForm, 
            setOpenBookingForm,
            bookingToEdit,
            setBookingToEdit,
            unitToBook,
            setUnitToBook,
            bookingPage,
            setBookingPage,

            // SNACKBAR MESSAGE
            snackbarMessage,
            setSnackbarMessage,
            
            // Image Uploader
            openImageUploader,
            setOpenImageUploader,
            imageToUpload,
            setImageToUpload,
            inputId,
            setInputId,
            imageUrl,
            setImageUrl,
            imageType,
            setImageType,

            
            // RENTALS
            activeRentalTab,
            setActiveRentalTab,

            // REQUEST EXTENSION
            openRequestExtension,
            setOpenRequestExtension,

            // PAYMENT CONFIG
            paymentConfig,
            setPaymentConfig,

            // PAYMENT FORM
            openPaymentForm,
            setOpenPaymentForm,


            // LOADING BACKDROP
            openLoadingBackdrop,
            setOpenLoadingBackdrop,

            // VIEW TENANT
            openViewTenant,
            setOpenViewTenant,
            tenantsPage,
            setTenantsPage,

            // TICKET FORM
            openTicketForm,
            setOpenTicketForm,
            ticketToEdit,
            setTicketToEdit,

            // REQUEST TENANCY EXTENSION
            openRequestTenancyExtension,
            setOpenRequestTenancyExtension,

            // RENTALS
            rentalsPage,
            setRentalsPage,

            // PUBLIC BOOKING
            openPublicBooking,
            setOpenPublicBooking,

            // TENANT BILLS
            tenantBillsPage,
            setTenantBillsPage,


            // ROLES
            rolesPage,
            setRolesPage,
            roleToEdit,
            setRoleToEdit,
            openRolesForm,
            setOpenRolesForm,

            // STAFF
            openStaffForm,
            setOpenStaffForm,
            staffToEdit,
            setStaffToEdit,
            staffPage,
            setStaffPage,


        }}>
            {children}
        </CollectionsContext.Provider>
    )
}

export {CollectionsContext, CollectionsProvider}

