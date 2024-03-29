import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Facebook, Instagram, Search, Twitter, YouTube } from '@mui/icons-material'
import Image from 'next/image'
import Link from 'next/link'
import MobileDrawer from 'Components/Common/MobileDrawer'

import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

function HouseType({ src, alt, title }: any) {
  return (
    <Link href={"/marketplace"}>
      <Box display="flex" gap="0.5rem" alignItems="center" border="1px solid" borderColor="primary.main" padding="1rem" borderRadius="0.5rem" bgcolor="white">
        <Box width={["4rem", "6rem"]}>
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            layout="responsive"
          />
        </Box>

        <Typography variant="h5" fontWeight="600" letterSpacing={-0.5}>{title}</Typography>
      </Box>
    </Link>
  )
}

export function UnitCard({ id, src, alt, title, subtitle, rent, features, location }: any) {
  return (
    <Link href={`/marketplace/${id}`}>
      <Box
        width="100%"
        borderRadius="1rem"
        border="1px solid gray"
        overflow="hidden"
        bgcolor="white"
        sx={{
          boxShadow: "0px 0px 30px 0px #D0CCD4",
          border: "1px solid #DDD5E4",
        }}
      >
        <Box width="100%">
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            layout="responsive"
          />
        </Box>
        <Box padding="1rem" display="flex" flexDirection="column" gap="0.375rem">
          <Typography variant="body2" fontWeight="600" letterSpacing={-0.5} lineHeight="100%" color="primary">{rent}</Typography>
          <Typography variant="h6" fontWeight="600" letterSpacing={-0.5} lineHeight="100%">{title}</Typography>
          <Typography variant="body1" fontWeight="500" letterSpacing={-0.5} color="gray" lineHeight="100%">{location}</Typography>
          <Typography variant="body2" fontWeight="500" letterSpacing={-0.5} color="gray" lineHeight="100%">{features}</Typography>
        </Box>
      </Box>
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Rent It</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={jakarta.className} style={{ width: '100vw', minHeight: "100vh", color: "black", backgroundColor: "#F2EEF6" }}>
        <nav style={{ width: "100%", position: "fixed", top: 0, left: 0, backgroundColor: "white", zIndex: 10 }}>
          <Box width="100%" padding={["1rem", "2rem", "2rem 4rem", "2rem 8rem", "2rem 12rem"]} display="flex" alignItems="center" borderBottom="1px solid #DDD5E4">
            <Typography fontSize="1.125rem" fontWeight="600" width="fit-content">Rent It</Typography>

            <Box display="flex" gap="4rem" ml="auto" alignItems="center" width="fit-content" >
              {/* <Button variant="outlined" sx={{ whiteSpace: "nowrap", width: "fit-content" }}>
                I am a tenant
              </Button> */}
              <Box display={["none", "flex"]} gap="2rem" >
                <Link href="/"><Typography fontWeight="600">Home</Typography></Link>
                <Link href="/marketplace"><Typography fontWeight="600">Marketplace</Typography></Link>
                <Link href="/login"><Typography fontWeight="600">Login</Typography></Link>
                <Link href="/signup"><Typography fontWeight="600">Sign Up</Typography></Link>
              </Box>
              <MobileDrawer />
            </Box>
          </Box>
        </nav>

        <section style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box minHeight="100vh" maxWidth="fit-content" margin="auto" display="flex" flexDirection="column" alignItems="center" gap="1rem" padding={["4rem 1rem", "8rem 2rem"]}>
            <Box width="100%" maxWidth="50rem" mt="8rem">
              <Image
                src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1688575640/RentIt/building-types/Group_j4ijw4.svg"
                alt="illustration"
                width={0}
                height={0}
                layout="responsive"
              />
            </Box>
            <Typography variant={"h2"} fontWeight="700" letterSpacing={-3}>Rental hunting made easy</Typography>
            <Typography variant="h6" letterSpacing={-0.5} color="gray">Find your next Condo, Appartment, house or room within seconds without a hustle</Typography>
            <TextField
              variant="outlined"
              sx={{ width: "100%", mt: "2rem" }}
              placeholder='Search location or rental type'
            />
          </Box>
        </section>

        <section style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Box maxWidth="100%" margin="auto" display="flex" flexDirection="column" alignItems="center" gap="1rem" padding={["6rem 1rem", "8rem 2rem"]}>
            <Typography variant="h3" fontWeight="600" letterSpacing={-3}>All types of rentals, in one place</Typography>
            <Typography variant="h6" letterSpacing={-0.5} color="gray">Whether it is for business or for your persona use, we have the right space for you!</Typography>
            <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr 1fr"]} gap="1rem" mt="2rem" width="100%">
              <HouseType
                src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1688483081/RentIt/building-types/House-Home-Property-Building-Rental_z5dqy2.svg"
                alt="Housing Units"
                title="Housing Units"
              />

              <HouseType
                src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1688483081/RentIt/building-types/Apartment-Real_Estate-Residental-Buildings-Property_t4v8qa.svg"
                alt="Apartment"
                title="Apartments"
              />

              <HouseType
                src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1688483080/RentIt/building-types/Apartment-Building-Real_Estate-Residental-Property_n7mbyh.svg"
                alt="Apartment"
                title="Business Blocks"
              />
            </Box>
          </Box>
        </section>

        <section style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box width="100%" minHeight="100vh" maxWidth="72rem" padding={["6rem 1rem", "8rem 2rem", "8rem 2rem"]} margin="auto" display="flex" flexDirection="column" alignItems="center" gap="1rem">
            <Typography variant="h3" fontWeight="600" letterSpacing={-3}>Check out our most popular spaces</Typography>
            <Typography variant="h6" letterSpacing={-0.5} color="gray">Discover the most popular rental spaces in your dream neighborhood, with the best deals. </Typography>
            <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr 1fr"]} gap={["1rem", "1rem", "2rem"]} mt="2rem" width="100%">
              <UnitCard
                src="/Frame30.png"
                alt="Housing Units"
                title="Housing Units"
                rent="UGX 1,000,000"
                location="Kampala, Uganda"
                features="3 bedrooms, 2 bathrooms"
              />
              <UnitCard
                src="/Frame30.png"
                alt="Housing Units"
                title="Housing Units"
                rent="UGX 1,000,000"
                location="Kampala, Uganda"
                features="3 bedrooms, 2 bathrooms"
              />
              <UnitCard
                src="/Frame30.png"
                alt="Housing Units"
                title="Housing Units"
                rent="UGX 1,000,000"
                location="Kampala, Uganda"
                features="3 bedrooms, 2 bathrooms"
              />
              <UnitCard
                src="/Frame30.png"
                alt="Housing Units"
                title="Housing Units"
                rent="UGX 1,000,000"
                location="Kampala, Uganda"
                features="3 bedrooms, 2 bathrooms"
              />
              <UnitCard
                src="/Frame30.png"
                alt="Housing Units"
                title="Housing Units"
                rent="UGX 1,000,000"
                location="Kampala, Uganda"
                features="3 bedrooms, 2 bathrooms"
              />
              <UnitCard
                src="/Frame30.png"
                alt="Housing Units"
                title="Housing Units"
                rent="UGX 1,000,000"
                location="Kampala, Uganda"
                features="3 bedrooms, 2 bathrooms"
              />
            </Box>

            <Button variant="contained" sx={{ mt: "2rem", p: "1rem", borderRadius: "0.5rem" }}>View More</Button>
          </Box>
        </section>


        <section style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box width="100%" minHeight="100vh" maxWidth="72rem" padding={["6rem 1rem", "2rem", "8rem 2rem"]} margin="auto" display="flex" flexDirection="column" alignItems="center" gap="1rem">
            <Typography variant="h3" fontWeight="600" letterSpacing={-3}>Get your favorite space in a few steps</Typography>
            <Typography variant="h6" letterSpacing={-0.5} color="gray">Discover the most popular rental spaces in your dream neighborhood, with the best deals. </Typography>
            <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr 1fr"]} gap={["1.5rem", "1rem", "2rem"]} mt="2rem" width="100%">
              <Box width="15rem" display="flex" flexDirection="column" alignItems="center" mx="auto">
                <Box width="4rem" >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </Box>
                <Typography fontWeight="600" fontSize="1.25rem">Browse</Typography>
                <Typography textAlign={"center"} color="gray" fontWeight="500">
                  Browse rentals based on location, rental, price and other filters to find your perfect living space
                </Typography>
              </Box>


              <Box width="15rem" display="flex" flexDirection="column" alignItems="center" mx="auto">
                <Box width="4rem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>

                </Box>
                <Typography fontWeight="600" fontSize="1.25rem">Reach Out</Typography>
                <Typography textAlign={"center"} color="gray" fontWeight="500">
                  Reach out to your desired property manager to negotiate terms of rent.
                </Typography>
              </Box>



              <Box width="15rem" display="flex" flexDirection="column" alignItems="center" mx="auto">
                <Box width="4rem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                  </svg>

                </Box>
                <Typography fontWeight="600" fontSize="1.25rem">Move In</Typography>
                <Typography textAlign={"center"} color="gray" fontWeight="500">
                  Move into your perfect living space after paying your rent and enjoy your new environment
                </Typography>
              </Box>

            </Box>


            <Button variant="contained" sx={{ mt: "2rem", mx: "auto", padding: "1rem", borderRadius: "0.5rem" }}>Find Your Rental Today</Button>
          </Box>
        </section>


        <footer style={{ width: "100%", backgroundColor: "white" }}>
          <Box width="100%" padding={["6rem 1rem", "8rem 2rem", "8rem 12rem"]}>

            <Box display={["flex"]} flexDirection="column" gap="2rem" justifyContent="space-between" alignItems="center" width="100%">
              <Typography>Rent It</Typography>

              <Box display="flex" gap="1rem" width="100%" justifyContent={"space-between"}>
                <Link href="/about"><Typography whiteSpace={"nowrap"} color="primary" fontWeight="600">Home</Typography></Link>
                <Link href="/about"><Typography whiteSpace={"nowrap"} color="primary" fontWeight="600">Market Place</Typography></Link>
                <Link href="/about"><Typography color="primary" fontWeight="600">Login</Typography></Link>
                <Link href="/about"><Typography color="primary" fontWeight="600">Signup</Typography></Link>
              </Box>

              <Box height="100%" my="auto" display="flex" flexDirection="row" gap="1rem">
                <Instagram />
                <Twitter />
                <Facebook />
                <YouTube />
              </Box>
            </Box>

          </Box>
        </footer>
      </main>
    </>
  )
}
