import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Facebook, Instagram, Search, Twitter, YouTube } from '@mui/icons-material'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

function HouseType({ src, alt, title }: any) {
  return (
    <Box display="flex" gap="0.5rem" alignItems="center" border="1px solid lightgrey" padding="1rem" borderRadius="0.5rem">
      <Box width="3rem">
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          layout="responsive"
        />
      </Box>

      <Typography variant="h6" fontWeight="600" letterSpacing={-0.5}>{title}</Typography>
    </Box>
  )
}

function UnitCard({ src, alt, title, subtitle, rent, features, location }: any) {
  return (
    <Box width="100%" borderRadius="1rem" border="1px solid gray" overflow="hidden">
      <Box width="100%">
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          layout="responsive"
        />
      </Box>
      <Box padding="0.875rem" display="flex" flexDirection="column" gap="0.375rem">
        <Typography variant="body2" fontWeight="600" letterSpacing={-0.5} lineHeight="100%" color="primary">{rent}</Typography>
        <Typography variant="h6" fontWeight="600" letterSpacing={-0.5} lineHeight="100%">{title}</Typography>
        <Typography variant="body1" fontWeight="500" letterSpacing={-0.5} color="gray" lineHeight="100%">{location}</Typography>
        <Typography variant="body2" fontWeight="500" letterSpacing={-0.5} color="gray" lineHeight="100%">{features}</Typography>
      </Box>
    </Box>
  )
}

export default function Marketplace() {
  return (
    <>
      <Head>
        <title>Rent It | Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ width: '100vw', minHeight: "100vh", color: "black", backgroundColor: "white" }}>
        <nav style={{ width: "100%", position: "fixed", top: 0, left: 0, backgroundColor: "white" }}>
          <Box width="100%" padding={["1rem", "2rem", "2rem 4rem", "2rem 8rem", "2rem 12rem"]} display="flex" alignItems="center">
            <Typography fontSize="1.125rem" fontWeight="600" width="fit-content">Rent It</Typography>

            <Box display="flex" gap="4rem" ml="auto" alignItems="center" width="fit-content" >
              <Button variant="outlined" sx={{ whiteSpace: "nowrap", width: "fit-content"}}>
                I am a tenant
              </Button>
              <Box display="flex" gap="1rem">
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
              </Box>
            </Box>
          </Box>
        </nav>

        <section style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
          <Box maxWidth="fit-content" margin="auto" display="flex" flexDirection="column" alignItems="center" gap="1rem">
            <Typography variant="h2" fontWeight="600" letterSpacing={-3}>Marketplace</Typography>
            <Typography variant="h6" letterSpacing={-0.5} color="gray">Browse, find and move into your preferred rental</Typography>
          </Box>
        </section>

        <section style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box width="100%" minHeight="100vh" maxWidth="72rem" padding={["1rem", "2rem", "8rem 2rem"]} margin="auto" display="flex" flexDirection="column" alignItems="center" gap="1rem">
            <Typography variant="h3" fontWeight="600" letterSpacing={-3}>Check out our most popular spaces</Typography>
            <Typography variant="h6" letterSpacing={-0.5} color="gray">Discover the most popular rental spaces in your dream neighborhood, with the best deals. </Typography>
            <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr"]} gap={["1rem", "1rem", "2rem"]} mt="2rem" width="100%">
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
          </Box>
        </section>


        <footer style={{ width: "100%", }}>
          <Box width="100%" padding={["8rem 1rem", "8rem 2rem", "8rem 2rem"]}>

            <Box display="flex" flexDirection={["column", "column", "row"]} gap="1rem" justifyContent="space-between" alignItems="center" width="100%">
              <Typography>Rent It</Typography>

              <Box display="flex" gap="1rem">
                <Link href="/about"><Typography whiteSpace={"nowrap"}>Home</Typography></Link>
                <Link href="/about"><Typography whiteSpace={"nowrap"}>Market Place</Typography></Link>
                <Link href="/about"><Typography>Login</Typography></Link>
                <Link href="/about"><Typography>Signup</Typography></Link>
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
