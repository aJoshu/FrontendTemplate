"use client";

import { useEffect, useState } from "react";
import DefaultCard from "../templates/card/default";
import { createCardAPI } from "@/api/card/createCard";
import { LOCAL_URL } from "@/constants/Network";
import {
    Button,
    Text,
    CopyButton,
    Tooltip,
} from "@mantine/core";
import { motion } from "framer-motion";
import { fetchUserCards } from "@/api/card/getUserCards";
import { useAuth } from "../context/AuthContext";
import Login from "../login/page";
import { lightenHexColor } from "@/components/lightenHexColor";
import { normalize } from "@/components/normalize";

type Project = {
    title: string;
    link: string;
};

export default function CreatePage() {
    const { user } = useAuth();
    const wasAuthenticated = typeof window !== "undefined" && localStorage.getItem("wasAuthenticated") === "true";

    const [displayName, setDisplayName] = useState("");
    const [description, setDescription] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    const [bgColor, setBgColor] = useState("#3b82f6");
    const [buttonColor, setButtonColor] = useState("#f5f5f5");
    const [buttonRadius, setButtonRadius] = useState<"xs" | "sm" | "md" | "lg" | "xl">("xl");
    const [effect, setEffect] = useState<string>("animate-sheen");
    const [showGit, setShowGit] = useState(false);
    const [githubUsername, setGithubUsername] = useState("");

    const [createdId, setCreatedId] = useState<string | null>(null);

    const handleChange = (index: number, field: "title" | "link", value: string) => {
        const updated = [...projects];
        updated[index][field] = value;
        setProjects(updated);
    };

    const handleAdd = (project?: Project) => {
        if (projects.length >= 6) return;
        setProjects((prev) => [...prev, project ?? { title: "", link: "" }]);
    };

    const handleDelete = (index: number) => {
        setProjects((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (createdId) return; // Don't allow duplicate creation

        try {
            const card = {
                title: displayName,
                description,
                projects,
                bgColor,
                buttonColor,
                effect,
                buttonRadius,
                showGit,
                githubUsername
            };
            const cleanedUsername = githubUsername.trim().replace(/[^a-zA-Z0-9-]/g, '').slice(0, 39);
            setGithubUsername(cleanedUsername);

            const response = await createCardAPI(card);
            setCreatedId(response.cardId);
        } catch (error) {
            console.error("Failed to create card", error);
        }
    };

    useEffect(() => {
        const loadCard = async () => {
            setLoading(true);
            try {
                const cards = await fetchUserCards();
                if (cards.length > 0) {
                    const card = cards[0];
                    setDisplayName(card.title);
                    setDescription(card.description);
                    setProjects(card.projects);
                    setBgColor(card.bgColor);
                    setEffect(card.effect);
                    setButtonColor(card.buttonColor);
                    setButtonRadius(card.buttonRadius);
                    setShowGit(card.showGit);
                    setGithubUsername(card.githubUsername);
                } else {
                    setDisplayName('Your Name');
                    setDescription('A description');
                }
                setLoading(false);
            } catch (err) {
                console.error("Error loading existing card:", err);
            }
        };

        loadCard();
    }, []);


    if (!user && !wasAuthenticated) {
        if (typeof window !== 'undefined') {
            localStorage.setItem("redirectPath", "/create");
            return <Login />;
        }
    }

    if (loading) return null;
    return (
        <div className="flex flex-col items-center min-h-screen py-22 px-4 mt-0 bg-white" style={{ background: `linear-gradient(45deg, ${lightenHexColor(bgColor, 10)}, ${lightenHexColor(bgColor, 20)})` }}>
            <DefaultCard
                cardId=""
                loading={loading}
                title={displayName}
                setTitle={setDisplayName}
                description={description}
                setDescription={setDescription}
                projects={projects}
                editor={true}
                onDelete={handleDelete}
                onChange={handleChange}
                onAdd={handleAdd}
                onSubmit={handleSubmit}
                bgColor={bgColor}
                setBgColor={setBgColor}
                buttonColor={buttonColor}
                setButtonColor={setButtonColor}
                buttonRadius={buttonRadius}
                setButtonRadius={setButtonRadius}
                setEffect={setEffect}
                effect={effect}
                setShowGit={setShowGit}
                showGit={showGit}
                setGithubUsername={setGithubUsername}
                githubUsername={githubUsername}
            />
            {/* <Button
                c={'black'}
                onClick={() => window.open(`${LOCAL_URL}/${normalize(displayName)}`, '_blank')}
                variant='white'
                h={32}
                className="md:-mt-6 mt-2"
            >
                Preview
            </Button> */}
            {createdId && (
                <div style={{ zIndex: 9999 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-lg shadow-3xl p-6 w-[90%] max-w-sm text-center"
                    >
                        <Text size="xl" fw={700} mb={4}>
                            Share this url
                        </Text>
                        <Text size="sm" c="gray.6" mb="sm" mt={-4}>
                            Tap the link below to copy it
                        </Text>

                        <CopyButton value={`${LOCAL_URL}/${normalize(displayName)}`}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? "Copied!" : "Click to copy"} withArrow position="bottom">
                                    <div
                                        onClick={copy}
                                        className="cursor-pointer rounded-sm bg-gray-100 px-4 py-2 mt-1 mb-4 text-md font-medium text-gray-800 transition hover:bg-gray-200 break-all"
                                    >
                                        {`${LOCAL_URL}/${normalize(displayName)}`}
                                    </div>
                                </Tooltip>
                            )}
                        </CopyButton>
                        <Button
                            fullWidth
                            radius="xl"
                            mt={24}
                            size="md"
                            onClick={() => window.open(`${LOCAL_URL}/${normalize(displayName)}`, '_blank')}
                        >
                            Preview
                        </Button>
                        <Button
                            onClick={() => setCreatedId(null)}
                            variant="transparent"
                            c={'black'}
                            mt={8}
                            mb={-16}
                        >
                            Close
                        </Button>

                    </motion.div>
                </div>
            )}

        </div>
    );
}
