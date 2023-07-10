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

    // BOOKING FORM
    const [openBookingForm, setOpenBookingForm] = useState(false)
    const [bookingToEdit, setBookingToEdit] = useState({})
    const [unitToBook, setUnitToBook] = useState({})


    // IMAGE UPLOADER
    const [openImageUploader, setOpenImageUploader] = useState(false)
    const [imageToUpload, setImageToUpload] = useState("https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg")


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

            // Bookings form
            openBookingForm, 
            setOpenBookingForm,
            bookingToEdit,
            setBookingToEdit,
            unitToBook,
            setUnitToBook,

            // SNACKBAR MESSAGE
            snackbarMessage,
            setSnackbarMessage,
            
            // Image Uploader
            openImageUploader,
            setOpenImageUploader,
            imageToUpload,
            setImageToUpload,


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
            setOpenPublicBooking

        }}>
            {children}
        </CollectionsContext.Provider>
    )
}

export {CollectionsContext, CollectionsProvider}

