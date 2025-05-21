import CreatePage from "../create/page";

export default function DashboardPage() {
  return <CreatePage />
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Grid,
//   Text,
//   Loader,
//   Center,
//   Container,
//   Button,
//   Tooltip,
//   CopyButton,
//   Stack,
//   Paper,
// } from "@mantine/core";
// import DefaultCard from "../templates/card/default";
// import { fetchUserCards } from "@/api/card/getUserCards";
// import { BASE_URL } from "@/constants/Network";

// export default function DashboardPage() {
//   const [cards, setCards] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const loadCards = async () => {
//       try {
//         const data = await fetchUserCards();
//         setCards(data);
//       } catch (err) {
//         console.error("Failed to load cards:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCards();
//   }, []);

//   if (loading) {
//     return (
//       <Center mt={128}>
//         <Loader />
//       </Center>
//     );
//   }

//   if (cards.length === 0) {
//     return (
//       <Container size="lg" py="xl">
//         <Text ta="center" mt="xl">
//           No cards yet. Create one!
//         </Text>
//       </Container>
//     );
//   }

//   const card = cards[0];
//   const shareUrl = `${BASE_URL}/${card.id}`;

//   return (
//     <Container size="lg" py="xl">
//       <Text fw={600} size="20px" className="pb-6">
//         Your card
//       </Text>
//       <Grid gutter="xl" align="center">
//         <Grid.Col span={{ base: 12, md: 6 }}>
//           <DefaultCard
//             title={card.title}
//             description={card.description}
//             projects={card.projects}
//             bgColor={card.bgColor}
//             buttonColor={card.buttonColor}
//             buttonRadius={card.buttonRadius}
//           />
//         </Grid.Col>

//         <Grid.Col span={{ base: 12, md: 6 }}>
//           <Stack gap="sm">
//             <Text size="sm" fw={500} c="gray.6">
//               Share this card
//             </Text>
//             <CopyButton value={shareUrl} timeout={1500}>
//               {({ copied, copy }) => (
//                 <Tooltip
//                   label={copied ? "Copied!" : "Click to copy"}
//                   withArrow
//                   position="top"
//                 >
//                   <Paper
//                     withBorder
//                     onClick={copy}
//                     p="sm"
//                     radius="md"
//                     className="cursor-pointer text-sm text-gray-700 hover:bg-gray-50 transition"
//                   >
//                     {shareUrl}
//                   </Paper>
//                 </Tooltip>
//               )}
//             </CopyButton>

//             <Button
//               onClick={() => router.push("/create")}
//               variant="default"
//               radius="md"
//               size="sm"
//             >
//               Edit
//             </Button>

//             <Button
//               component="a"
//               href={shareUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               variant="light"
//               radius="md"
//               size="sm"
//             >
//               Preview
//             </Button>
//           </Stack>
//         </Grid.Col>
//       </Grid>
//     </Container>
//   );
// }
