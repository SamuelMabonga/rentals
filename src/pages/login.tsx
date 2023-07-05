import { Box, Button, Card, Checkbox, Divider, FormControl, FormLabel, LinearProgress, TextField, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image';

const formSchema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
})

export default function Login() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema)
    });

    async function onSubmit(values: any) {
        setIsLoading(true)
        console.log(values)
        const { email, password } = values

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        console.log(result)

        if (result?.ok) {
            router.push("/dashboard")
        }

    }

    return (
        <>
            <Head>
                <title>Rentals</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main style={{ width: "100vw", minHeight: "100vh" }}>
                <Box
                    width="100vw"
                    height={"100vh"}
                    sx={{
                        bgcolor: "primary.light",
                    }}
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                // overflow="scroll"
                >
                    <Box overflow={"hidden"} position="relative">
                        <Image
                            src="https://res.cloudinary.com/dfmoqlbyl/image/upload/c_crop,h_1600,w_900/v1688576609/RentIt/houses_tkovar.png"
                            alt="houses"
                            width={0}
                            height={0}
                            layout="responsive"
                        />

                        <Box
                            overflow={"hidden"}
                            sx={{ background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #1E1E1E 99.47%)" }}
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            padding="1.5rem"
                            display="flex"
                            flexDirection="column"
                        >


                            <Typography variant="h3" fontWeight="600" letterSpacing={-1} lineHeight="110%" mt="auto">
                                Effortlessly manage your rental properties and tenants with Rentals.
                            </Typography>
                            <Typography variant="h6" lineHeight="130%">
                                Simplify property management with our easy-to-use app. Keep track of rent payments, maintenance requests, and tenant communications all in one place. Get started today and streamline your rental business.
                            </Typography>

                            <Box mt="2rem">
                                <Typography variant="h5" fontWeight="600">Features</Typography>
                                <Box ml="1rem">
                                    <ul>
                                        <li>
                                            <Typography>
                                                Simplify your property management with Rental Management.
                                            </Typography>
                                        </li>

                                        <li>
                                            <Typography>
                                                Simplify rent management with just a few clicks.
                                            </Typography>
                                        </li>

                                        <li>
                                            <Typography>
                                                Effortlessly manage rental issues and keep tenants happy.
                                            </Typography>
                                        </li>
                                    </ul>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Card
                            sx={{
                                bgcolor: "white",
                                width: ["90vw", "30rem"],
                                my: "auto",
                                borderRadius: "1rem",
                                boxShadow: "0px 0px 30px 0px #D0CCD4",
                                border: "1px solid #DDD5E4"
                            }}
                        >
                            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2rem",
                                    padding: "1.5rem"
                                }}
                            >
                                <Typography color="primary.dark" mx="auto">Rentals</Typography>
                                <Box display="flex" flexDirection="column">
                                    <Typography color="primary.dark" mx="auto" fontSize="1.5rem" fontWeight="600">Login</Typography>
                                    <Typography color="primary.dark" mx="auto" textAlign="center">Enter your credentials to continue</Typography>
                                </Box>
                                <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                                    <Box width="100%" display="flex" flexDirection="column" gap="1rem">
                                        <TextField
                                            variant="outlined"
                                            {...register("email")}
                                            placeholder="Email"
                                            sx={{
                                                width: "100%",
                                            }}
                                        />
                                        <TextField
                                            variant="outlined"
                                            {...register("password")}
                                            placeholder="Password"
                                            sx={{
                                                width: "100%",
                                            }}
                                        />
                                    </Box>
                                </form>
                                <Button disabled={isLoading} type="submit" form="login-form" variant="contained" sx={{ padding: "1rem", borderRadius: "0.5rem" }}>Login</Button>
                                <Divider orientation="horizontal" />
                                <Link href="/signup" style={{ marginRight: "auto", marginLeft: "auto" }}><Typography>Don't have an account?</Typography></Link>
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </main>
        </>
    )
}