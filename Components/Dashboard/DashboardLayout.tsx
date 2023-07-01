import { Menu } from "@mui/icons-material"
import { Avatar, Box, Button, CircularProgress, IconButton, Snackbar, Typography } from "@mui/material"
import ConsecutiveSnackbars from "Components/Common/ConsecutiveSnackbars"
import LoadingBackdrop from "Components/Common/LoadingBackdrop"
import MobileDrawer from "Components/Common/MobileDrawer"
import NavItem from "Components/Common/NavItem"
import RegularSnackbar from "Components/Common/RegularSnackBar"
import { CollectionsContext } from "context/context"
// import ImageUploader from "Components/Common/ImageUploader"
import { motion, useIsomorphicLayoutEffect } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"

const ImageUploader = dynamic(() =>
    import('../Common/ImageUploader'),
    { ssr: false }
)

const MBox = motion(Box)
const MTypo = motion(Typography)

export default function DashboardLayout({ children }: any) {

    // CONTEXT
    const { setSnackbarMessage }: any = useContext(CollectionsContext)


    const router = useRouter()
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            // The user is not authenticated, handle it here.
            // router.push("/login")
        },
    })

    const { user }: any = session || {}
    const {
        first_name,
        last_name,
    } = user || {}


    // SIDE NAV WIDTH
    const sideNavRef: any = useRef()
    const container: any = useRef()
    const navBar: any = useRef()
    const [width, setWidth] = useState(0)
    const [sideNavWidth, setSideNavWidth] = useState(0)
    const [navBarHeight, setNavBarHeight] = useState(0)


    useIsomorphicLayoutEffect(() => {
        // if (!sideNavRef?.current?.offsetWidth) return; // wait for the elementRef to be available
        // if (!navBar?.current) return; // wait for the elementRef to be available
        // if (!container?.current) return; // wait for the elementRef to be available

        const resizeObserver: any = new ResizeObserver(() => {
            // Do what you want to do when the size of the element changes
            const navWidth = sideNavRef?.current?.offsetWidth
            const barHeight = navBar?.current?.offsetHeight
            const viewWidth = window.innerWidth
            setWidth(viewWidth - navWidth)
            setSideNavWidth(navWidth)
            setNavBarHeight(barHeight)
        });
        resizeObserver?.observe(container?.current);
        return () => resizeObserver.disconnect(); // clean up 
    }, [])

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 2000)
    }, [])


    // const router = useRouter();

// Listen for route changes
useEffect(() => {
  const handleRouteChangeStart = () => {
    // Set loading state to true when route change starts

    setSnackbarMessage({
        open: true,
        vertical: 'top',
        horizontal: 'center',
        message: "Loading...",
        icon: <Box color="white"><CircularProgress size={24} color="inherit" /></Box>
    })
  };

  const handleRouteChangeComplete = () => {
    // Set loading state to false when route change completes
    setSnackbarMessage({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: "",
        icon: <CircularProgress size={24} />
    })

    // Scroll to top on route change
    window.scrollTo(0, 0);
  };

  // Add event listeners for route changes
  router.events.on('routeChangeStart', handleRouteChangeStart);
  router.events.on('routeChangeComplete', handleRouteChangeComplete);

  // Clean up the event listeners on unmount
  return () => {
    router.events.off('routeChangeStart', handleRouteChangeStart);
    router.events.off('routeChangeComplete', handleRouteChangeComplete);
  };
}, []);


    return (
        <>
            <Head>
                <title>Rent It</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <script
                    src="https://widget.Cloudinary.com/v2.0/global/all.js"
                    type="text/javascript"
                ></script>
            </Head>
            <main style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
                <Box
                    ref={container}
                    display="flex"
                    width="100%"
                    minHeight="100vh"
                    maxHeight={["fit-content", "100vh"]}
                    sx={{
                        bgcolor: "white",
                        overflowY: ["hidden", "scroll"]
                    }}
                >
                    {/* NAV */}
                    <Box
                        ref={sideNavRef}
                        position="fixed"
                        left={0}
                        height="100vh"
                        minWidth={["fit-content", "fit-content", "fit-content", "20rem"]}
                        display={["none", "flex"]}
                        flexDirection="column"
                        gap="4rem"
                        sx={{ bgcolor: "white" }}
                        padding={["0 1rem 1rem 1rem", "0 1rem 1rem 1rem", "0 1rem 1rem 1rem", "0 1rem 1rem 8rem"]}
                        border="1px solid primary.dark"
                    >
                        <Box
                            height={`${navBarHeight}px`}
                            padding="1.5rem 0"
                            display="flex" alignItems="center">
                            <Typography color="primary" fontWeight="600">Rent It</Typography>
                            {/* <IconButton disabled>
                                    <Box width="1.5rem" height="1.5rem">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>

                                    </Box>
                                </IconButton> */}
                        </Box>

                        <Box display="flex" flexDirection="column" gap="0.5rem" alignItems="center">
                            <Avatar
                                variant="circular"
                                alt={`${first_name} ${last_name}`}
                                sx={{
                                    width: ["2rem", "3rem", "5rem"],
                                    height: ["2rem", "3rem", "5rem"]
                                }}
                            />
                            <Box display={["none", "none", "flex"]} flexDirection="column" alignItems="center">
                                <Typography textAlign="center" color="black" fontWeight={"600"}>{`${first_name} ${last_name}`}</Typography>
                                <Button variant="outlined" size="small" sx={{ mt: "0.5rem" }}>Edit</Button>
                            </Box>
                        </Box>
                        <Box display={"flex"} flexDirection="column" gap="0.5rem">
                            <NavItem
                                to="/dashboard"
                                label="Dashboard"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                }
                            />
                            <NavItem
                                to="/properties"
                                label="My Properties"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                    </svg>

                                }
                            />
                            <NavItem
                                to="/rentals"
                                label="My Rentals"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                                    </svg>
                                }
                            />
                            <NavItem
                                to="/billingPeriods"
                                label="Billing Periods"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                    </svg>

                                }
                            />
                            <NavItem
                                to="/features"
                                label="Features"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                                    </svg>
                                }
                            />
                            <NavItem
                                to="/users"
                                label="Users"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                    </svg>

                                }
                            />
                            <NavItem
                                label="My Tenants"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>

                                }
                            />
                            <NavItem
                                label="My Payments"
                                svg={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>

                                }
                            />
                        </Box>

                        <Box>
                            <button onClick={() => signOut()}>logout</button>
                        </Box>
                    </Box>

                    {/* DASHBOARD CONTENT */}
                    <Box
                        ml={[0, `${sideNavWidth}px`]}
                        position="relative"
                        width={width}
                        display="flex"
                        flexDirection="column"
                        height="fit-content"
                        minHeight="100vh"
                    >
                        <Box
                            ref={navBar}
                            position="fixed"
                            top={0}
                            right={0}
                            width={width}
                            zIndex={2}
                            padding={["1rem", "1rem", "1rem", "1rem 8rem 1rem 2rem"]}
                            bgcolor={"white"}
                            display="flex"
                            justifyContent={"space-between"}
                            alignItems="center"
                            // sx={{
                            //     boxShadow: ["0px 4px 20px rgba(211, 205, 218, 0.25)", "none", ],
                            //     border: ["solid rgba(211, 205, 218, 0.7)", ],
                            //     borderWidth: ["0px 0px 1px 0px"]
                            // }}
                        >
                            <Box display={["flex", "none"]} flexDirection="row" alignItems={"center"} gap="0.25rem">
                                <MobileDrawer />
                                <Typography color="primary" lineHeight="100%" fontWeight="600">Rent It</Typography>
                            </Box>

                            <Typography color="gray" display={["none", "flex"]} fontWeight="600">Dashboard</Typography>

                            <Box display="flex" gap="0.5rem" alignItems="center">
                                <IconButton>
                                    <Box width="1.5rem" height="1.5rem">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>

                                    </Box>
                                </IconButton>

                                <Avatar
                                    variant="circular"
                                    alt="Samuel Mabonga"
                                    sx={{
                                        width: ["2rem"],
                                        height: ["2rem"],
                                        display: ["flex", "none"]
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box
                            mt={`${navBarHeight}px`}
                            width="100%"
                            // minHeight={`${window?.innerHeight - navBarHeight}px`}
                            padding={["1rem", "1rem", "1rem", "2rem 8rem 2rem 2rem"]}
                            // border="1px solid red"
                            display="flex"
                            flexDirection="column"
                            gap="1.5rem"
                            bgcolor={"primary.light"}
                            borderRadius="1rem"
                            sx={{
                                boxShadow: ["inset 0px 4px 20px rgba(211, 205, 218, 1)", "none", ],
                                border: ["1px solid rgba(211, 205, 218, 0.7)", "0px", ],
                            }}
                        // sx={{
                        //     overflowY: ["hidden", "scroll"]
                        // }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Box>
                {/* <ConsecutiveSnackbars /> */}
                <RegularSnackbar />
                <ImageUploader />
                <LoadingBackdrop />

                {/* PRELOADER */}
                <MBox
                    // display={isLoading ? "flex" : "none"}
                    position="absolute"
                    display="flex"
                    top={0}
                    left={0}
                    width="100vw"
                    height="100vh"
                    zIndex={100}
                    bgcolor="white"
                    initial={{
                        top: 0,
                        left: 0
                    }}
                    animate={!isLoading && {
                        left: "100%"
                    }}
                >
                    
                    <MTypo
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{
                            ease: "easeInOut",
                            duration: 1
                        }}
                        fontWeight={"600"}
                        color="primary"
                        m="auto"
                    >
                        Rent It
                    </MTypo>

                </MBox>
            </main>
        </>
    )
}