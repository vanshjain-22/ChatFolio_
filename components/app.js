import { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Stack,
  Spinner,
  Center,
  Image as CImage,
  Text,
  Link,
  Button,
  HStack,
  Spacer,
  VStack,
  keyframes,
} from "@chakra-ui/react";
import Dashboard from "./dashboard-story";
import Uploader from "./upload";
import axios from "axios";
import { API_URL } from "../constants";
import Intro from "./intro";
import Marquee from "react-fast-marquee";

const spin = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg)}
`;

// random up down animation
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomUpDownAnimation = keyframes`
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(${random(10, 50)}px);
    }
    100% {
        transform: translateY(0px);
    }
`;

const App = () => {
  const spinAnimation = `${randomUpDownAnimation} infinite 10s linear`;

  const [isUploading, setIsUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // const imagesPreload = [
    //   "static/bg2.png",
    //   "static/bg3.png",
    //   "static/bg4.png",
    //   "static/bg5.png",
    //   "static/bg6.png",
    //   "static/bg7.png",
    //   "static/bg8.png",
    //   "static/bg9.png",
    //   "static/bg11.png",
    //   "static/bg99.png",
    // ];
    // imagesPreload.forEach((image) => {
    //   const newImage = new Image();
    //   newImage.src = image;
    //   window[image] = newImage;
    // });

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Optionally, send analytics event that PWA install promo was shown.
      // console.log(`'beforeinstallprompt' event was fired.`);
    });

    // check if the website is opened in standalone mode / PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsSuccessfulPWAInstall(true);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.onmessage = (event) => {
        // console.log("received: onmessage", event);
        var imageBlob = event.data.file;
        const data = new FormData();
        data.append("file", imageBlob);
        setShowLoader(true);
        setShowUploader(true);
        document.body.style.overflow = "hidden";
        axios
          .post(API_URL + "wrap", data, {
            // receive two parameter endpoint url ,form data
          })
          .then((res) => {
            setData(res.data);
            setIsDemo(false);
            setShowRes(true);
          })
          .catch((error) => {
            try {
              alert(
                typeof error.response.data === "string"
                  ? error.response.data
                  : "Connection failed. Try again!"
              );
            } catch (error) {
              alert(
                "Connection failed. Try again!"
              );
            }
          });
      };
    } else {
      // console.log("service worker not supported 3");
    }
  });

  const [showRes, setShowRes] = useState(false);
  const [data, setData] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isSuccessfulPWAInstall, setIsSuccessfulPWAInstall] = useState(false);

  return showRes ? (
    <Dashboard drawData={data} isDemo={isDemo} />
  ) : (
    <Box
      w="100%"
      bgColor="#000"
      overflow="hidden"
      h="100vh"
      position="relative"
    >
      {showUploader || showLoader ? (
        <Uploader
          setIsDemo={setIsDemo}
          setShowRes={setShowRes}
          setData={setData}
          setShowUploader={setShowUploader}
          showLoader={showLoader}
          setShowLoader={setShowLoader}
          deferredPrompt={deferredPrompt}
          isSuccessfulPWAInstall={isSuccessfulPWAInstall}
          setIsSuccessfulPWAInstall={setIsSuccessfulPWAInstall}
        />
      ) : (
        " "
      )}

<HStack
  p="1rem 1.5rem 0.6rem 1.5rem"
  align="center"
  bgColor={"#000"}
  w="100%"
  // position="fixed"
  direction={["column", "row"]}
  zIndex="50"
  h="10vh"
>
  {process.env.NEXT_PUBLIC_ENV === "staging" ? (
    <>
      <Text textColor={"white"}> Staging </Text>
    </>
  ) : (
    ""
  )}

  {/* Add your text here in the middle of the stack */}
  <Text textColor={"white"}  flex="1" textAlign="center" marginLeft="600px"
  fontSize="6xl"
  color="white"
  pt={"1rem"}
  w={"100%"}
  fontWeight="600"
  align={"start"}
  marginBottom="20px">
    CHATFOLIO
  </Text>

  <Spacer w={"100%"} />
  <Button
    colorScheme="primary"
    p={{
      base: ["2rem", "1.5rem"],
      sm: ["2rem", "1.5rem"],
      lg: ["2rem", "1.5rem"],
    }}
    borderRadius={50}
    onClick={() => {
      setShowUploader(true);
      // Disable scroll
      document.body.style.overflow = "hidden";
    }}
  >
    <Text fontSize={{ base: "sm", sm: "sm", lg: "md" }} color="dark">
      Make your wrap
    </Text>
  </Button>
</HStack>


      {/* <HStack
        p="1rem 1.5rem 0.6rem 1.5rem"
        align="center"
        bgColor={"#000"}
        w="100%"
        // position="fixed"
        direction={["column", "row"]}
        zIndex="50"
        h="10vh"
      >
        

        
        {process.env.NEXT_PUBLIC_ENV === "staging" ? (
          <>
            
            <Text textColor={"white"}> Staging </Text>
          </>
        ) : (
          ""
        )}
        
        <Spacer w={"100%"} />
        <Button
          colorScheme="primary"
          p={{
            base: ["2rem", "1.5rem"],
            sm: ["2rem", "1.5rem"],
            lg: ["2rem", "1.5rem"],
          }}
          borderRadius={50}
          onClick={() => {
            setShowUploader(true);
            // Disable scroll
            document.body.style.overflow = "hidden";
          }}
        >
          
          <Text fontSize={{ base: "sm", sm: "sm", lg: "md" }} color="dark">
            Make your wrap
          </Text>
          
        </Button>
      </HStack> */}
      <Box>
        <Box>
          <Intro setShowUploader={setShowUploader} />

          {/* <Box>
            <CImage
              src="static/original/pink.svg"
              position="fixed"
              top="22vh"
              left="8vw"
              width="16rem"
              height="10rem"
              display={{ base: "none", sm: "none", md: "none", lg: "block" }}
              opacity={0.6}
              // zIndex={0}
              animation={spinAnimation}
            />

            <CImage
              src="static/original/yellow.svg"
              position="absolute"
              top="65vh"
              left="8vw"
              width="16rem"
              height="10rem"
              display={{ base: "none", sm: "none", md: "none", lg: "block" }}
              opacity={0.6}
              zIndex={0}
              animation={spinAnimation}
            />

            <CImage
              src="static/original/green.svg"
              position="absolute"
              top="44vh"
              right="8vw"
              width="16rem"
              height="10rem"
              display={{ base: "none", sm: "none", md: "none", lg: "block" }}
              opacity={0.6}
              zIndex={0}
              animation={spinAnimation}
            /> */}
          {/* </Box> */}
        </Box>

        {/* <Box>
          {showLoader ? (
            <Box h="80vh">
              <Center mt="2rem">
                <Text>
                  {" "}
                  Brewing your story...
                  <br />
                  Usually takes less than 20 seconds.
                  <br />
                </Text>
                <Spinner size="xl" />
              </Center>
            </Box>
          ) : (
            " "
          )}
        </Box> */}
      </Box>
    </Box>
  );
};
export default App;
