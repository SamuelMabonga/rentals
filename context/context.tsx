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

    // FORMS
    const [showUnitTypeForm, setShowUnitTypeForm] = useState(false)
    
    // PROPERTY FORM
    const [showPropertyForm, setShowPropertyForm] = useState(false)
    const [propertyToEdit, setPropertyToEdit] = useState()

    // FEATURE FORM
    const [openFeaturesForm, setOpenFeaturesForm] = useState(false)
    const [featureToEdit, setFeatureToEdit] = useState()

    // BILLING PERIODS FORM
    const [openBillingPeriodsForm, setOpenBillingPeriodsForm] = useState(false)
    const [billingPeriodsToEdit, setBillingPeriodsToEdit] = useState(false)

    // PROPERTY FEATURES FORM
    const [openPropertyFeaturesForm, setOpenPropertyFeaturesForm] = useState(false)
    const [propertyFeatureToEdit, setPropertyFeatureToEdit] = useState(false)

    // UNIT FORM
    const [openUnitForm, setOpenUnitForm] = useState(false)
    const [unitToEdit, setUnitToEdit] = useState(false)


    // IMAGE UPLOADER
    const [openImageUploader, setOpenImageUploader] = useState(false)
    const [imageToUpload, setImageToUpload] = useState("https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg")

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

            // Billing Periods
            openBillingPeriodsForm,
            setOpenBillingPeriodsForm,
            billingPeriodsToEdit,
            setBillingPeriodsToEdit,


            // Property Features form
            openPropertyFeaturesForm,
            setOpenPropertyFeaturesForm,
            propertyFeatureToEdit,
            setPropertyFeatureToEdit,

            // Unit Form
            openUnitForm,
            setOpenUnitForm,
            unitToEdit,
            setUnitToEdit,

            

            
            // Image Uploader
            openImageUploader,
            setOpenImageUploader,
            imageToUpload,
            setImageToUpload
        }}>
            {children}
        </CollectionsContext.Provider>
    )
}

export {CollectionsContext, CollectionsProvider}

