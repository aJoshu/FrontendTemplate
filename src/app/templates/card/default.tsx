"use client";

import {
    Button,
    Stack,
    ActionIcon,
    TextInput,
    Modal,
    SimpleGrid,
    Textarea,
    Switch,
} from "@mantine/core";
import { Trash, Image as ImageIcon, Plus, Pencil, ArrowLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { trackCardView, trackProjectClick } from "@/api/card/analytics";
import GitHubWidget from "../widgets/github";
import { customNotification } from "@/components/notifications/customNotifications";

type Project = {
    title: string;
    link: string;
};

type DefaultCardProps = {
    cardId: string;
    title?: string;
    loading?: boolean;
    setTitle?: (val: string) => void;
    description?: string;
    setDescription?: (val: string) => void;
    projects: Project[];
    size?: "full" | "compact";
    editor?: boolean;
    onSubmit?: () => void;
    onDelete?: (index: number) => void;
    onChange?: (index: number, field: "title" | "link", value: string) => void;
    onAdd?: (project: Project) => void;
    effect?: string;
    setEffect?: (val: string) => void;
    bottomText?: string;
    setShowGit?: (val: boolean) => void;
    showGit?: boolean;
    setGithubUsername?: (val: string) => void;
    githubUsername?: string;

    bgColor?: string;
    setBgColor?: (val: string) => void;
    buttonColor?: string;
    setButtonColor?: (val: string) => void;
    buttonRadius?: "xs" | "sm" | "md" | "lg" | "xl";
    setButtonRadius?: (val: "xs" | "sm" | "md" | "lg" | "xl") => void;
};

const COLOR_OPTIONS = [
    "#ffffff", // white
    "#f97316", // orange
    "#22c55e", // green
    "#3b82f6", // blue
    "#9333ea", // purple
    "#f43f5e", // pink-red
    "#0f172a", // navy (dark)
    "#1e293b", // slate (dark)
    "#475569", // blue-gray
    "#fef9c3", // pastel yellow
    "#f0abfc", // soft pink-lilac
    "#a5f3fc", // pale aqua
];


const BUTTON_COLOR_OPTIONS = [
    "#f5f5f5", // light gray (default)
    "#000000", // black
    "#1e40af", // blue
    "#ef4444", // red
    "#facc15", // golden yellow
    "#10b981", // emerald green
    "#d946ef", // violet pink
    "#111827", // soft black (slate-900)
];

const cardEffects = ["none", "static-pyramid", "animate-sheen", "animate-waves", "animate-vertical-pulse", "animate-aura-pulse", "animate-comic-lines"];

const BUTTON_RADIUS_OPTIONS = ["xs", "sm", "md", "lg", "xl"] as const;

function isDark(hex: string): boolean {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

export default function DefaultCard({
    cardId,
    loading = false,
    title = "Your Name",
    projects,
    size = "full",
    editor = false,
    setTitle,
    description,
    setDescription,
    onDelete,
    onChange,
    onAdd,
    onSubmit,
    bgColor = "#0f172a",
    setBgColor,
    buttonColor = "#f5f5f5",
    setButtonColor,
    buttonRadius = "xl",
    setButtonRadius,
    bottomText = 'Powered by projct.dev',
    effect,
    setEffect,
    setShowGit,
    showGit,
    setGithubUsername,
    githubUsername
}: DefaultCardProps) {

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [newProjectModal, setNewProjectModal] = useState(false);
    const [modalProject, setModalProject] = useState<Project>({ title: "", link: "" });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleModalSave = () => {
        if (!modalProject.title || !modalProject.link) return;

        const isEditing = editingIndex !== null;

        // ✅ Prevent adding if already at limit
        if (!isEditing && projects.length >= 8) return;

        if (isEditing && onChange) {
            onChange(editingIndex, "title", modalProject.title);
            onChange(editingIndex, "link", modalProject.link);
        } else {
            onAdd?.(modalProject); // <- this must exist
        }

        setModalProject({ title: "", link: "" });
        setEditingIndex(null);
        setNewProjectModal(false);
    };


    useEffect(() => {
        if (!editor) {
            trackCardView(cardId);
        }
    }, [editor]);

    const normalizeUrl = (url: string): string => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return `https://${url}`;
        }
        return url;
    };

    return (
        <>
            <div className="w-full flex justify-center items-center px-4 py-0 sm:py-8 select-none">
                <div
                    className={`w-full ${size === "compact"
                        ? "max-w-[220px]"
                        : size === "full"
                            ? "max-w-[360px]"
                            : "max-w-[280px]"
                        } aspect-[9/14.5] overflow-hidden relative transition-colors`}
                    style={{
                        backgroundColor: bgColor,
                        borderRadius: size === "compact" ? 16 : 32,
                        boxShadow: "0 0 32px 12px rgba(255,255,255,0.05), 16px 4px 64px rgba(0,0,0,0.3)",
                    }}
                >
                    {/* Animations and effects */}
                    {effect && <div className={`${effect} rounded-[inherit]`} />}

                    {/* Card starts now */}
                    {editor ? (
                        <TextInput
                            value={loading ? '' : title}
                            autoComplete="off"
                            autoCorrect="off"
                            maxLength={16}
                            mt={16}
                            spellCheck={false}
                            onChange={(e) => setTitle?.(e.target.value)}
                            size="md"
                            radius="xl"
                            variant="unstyled"
                            styles={{
                                input: {
                                    textAlign: "center",
                                    fontWeight: 700,
                                    fontSize: 20,
                                    color: isDark(bgColor) ? "#fff" : "#000",
                                },
                            }}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-[280px] mx-auto mt-5.5 text-center font-bold text-[20px]"
                            style={{ color: isDark(bgColor) ? "#fff" : "#000" }}
                        >
                            {title}
                        </motion.div>
                    )}

                    {/* Description */}
                    {editor ? (
                        <Textarea
                            value={loading ? '' : description}
                            onChange={(e) => {
                                const rawValue = e.target.value;
                                const lineBreaks = (rawValue.match(/\n/g) || []).length;

                                if (lineBreaks >= 2) return; // prevent more than 2 line breaks

                                const value = rawValue.slice(0, 60);
                                setDescription?.(value);
                            }}

                            autoCorrect="off"
                            spellCheck={false}
                            autosize
                            size="sm"
                            maxLength={50}
                            variant="unstyled"
                            minRows={1}
                            maxRows={3}
                            className="mt-1 w-full max-w-[280px] mx-auto"
                            styles={{
                                input: {
                                    textAlign: "center",
                                    fontSize: 16,
                                    color: isDark(bgColor) ? "#fff" : "#000",
                                    resize: "none",
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    padding: 0,
                                },
                            }}
                        />
                    ) : description ? (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                            className="text-center text-[16px] mt-2.5 w-full max-w-[280px] mx-auto"
                            style={{
                                color: isDark(bgColor) ? "#fff" : "#444",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            {description}
                        </motion.div>
                    ) : null}

                    {/* Background Picker */}
                    {editor && (
                        <ActionIcon
                            onClick={() => setModalOpened(true)}
                            variant='light'
                            bg={isDark(bgColor) ? "#fff" : "#000"}
                            radius="xl"
                            size="lg"
                            style={{
                                color: isDark(bgColor) ? "#000" : "#fff",
                                boxShadow: "0 0 16px 6px rgba(255,255,255,0.05), 4px 2px 8px rgba(0,0,0,0.2)",

                            }}
                            className="absolute bottom-4 left-4 z-20"
                        >
                            <ImageIcon size={18} />
                        </ActionIcon>
                    )}

                    <div
                        className="overflow-y-auto flex flex-col items-center text-center px-4 py-2"
                        style={{ maxHeight: 'calc(100% - 160px)', scrollbarWidth: 'thin' }}
                    >                        <Stack gap="sm" className="w-full max-w-[280px]">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    style={{ marginBottom: 4 }}
                                    className="relative group"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                >
                                    {editor && hoverIndex === index && (
                                        <motion.div
                                            style={{ zIndex: 999 }}
                                            initial={{ opacity: 0, scale: 0.8, y: -6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -6 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute -top-2 left-0 z-10"
                                        >
                                            <ActionIcon
                                                onClick={() => {
                                                    setModalProject(project);
                                                    setEditingIndex(index);
                                                    setNewProjectModal(true);
                                                }}
                                                variant="solid"
                                                size="sm"
                                                bg="blue"
                                                radius="xl"
                                            >
                                                <Pencil size={14} />
                                            </ActionIcon>
                                        </motion.div>
                                    )}

                                    {editor && hoverIndex === index && (
                                        <motion.div
                                            style={{ zIndex: 999 }}
                                            initial={{ opacity: 0, scale: 0.8, y: -6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -6 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute -top-2 right-0 z-10"
                                        >
                                            <ActionIcon
                                                onClick={() => onDelete?.(index)}
                                                variant="solid"
                                                color="red"
                                                size="sm"
                                                radius="xl"
                                            >
                                                <Trash size={14} />
                                            </ActionIcon>
                                        </motion.div>
                                    )}

                                    <Button
                                        component="a"
                                        href={normalizeUrl(project.link) || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        radius={buttonRadius}
                                        size="md"
                                        variant="filled"
                                        color="gray"
                                        onClick={() => {
                                            if (!editor) {
                                                trackProjectClick(cardId, project.link);
                                            }
                                        }}
                                        style={{
                                            backgroundColor: buttonColor,
                                            color: isDark(buttonColor) ? "#fff" : "#000",
                                            fontWeight: 500,
                                            zIndex: 500,
                                            marginLeft: size === "compact" ? 8 : 12,
                                            marginRight: size === "compact" ? 8 : 12,
                                            maxWidth: size === "compact" ? 240 : "100%",
                                            margin: "0 auto",
                                        }}
                                        className="flex items-center gap-2 justify-start"
                                    >
                                        {project.link && (
                                            <img
                                                src={`https://unavatar.io/${new URL(normalizeUrl(project.link)).hostname}`}
                                                alt="favicon"
                                                className="w-5 h-5 mr-2 rounded-sm"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        )}
                                        {project.title || "Untitled Project"}
                                    </Button>
                                </motion.div>
                            ))}

                            {/* Add FAB (mobile) */}
                            {editor && (
                                <ActionIcon
                                    onClick={() => {
                                        if (projects.length >= 6) {
                                            customNotification('Error', 'Max links reached')
                                            return null;
                                        }
                                        setModalProject({ title: "", link: "" });
                                        setEditingIndex(null);
                                        setNewProjectModal(true);
                                    }}
                                    variant="light"
                                    color="brand"
                                    bg={isDark(bgColor) ? "#fff" : "#000"}
                                    style={{
                                        color: isDark(bgColor) ? "#000" : "#fff",
                                        boxShadow: "0 0 16px 6px rgba(255,255,255,0.05), 4px 2px 8px rgba(0,0,0,0.2)",
                                    }}
                                    radius="xl"
                                    size="lg"
                                    className="absolute bottom-4 right-4 z-20 shadow-lg"
                                >
                                    <Plus size={18} />
                                </ActionIcon>
                            )}
                        </Stack>
                        {showGit && <GitHubWidget githubUsername={githubUsername} />}
                    </div>
                    {editor && projects.length < 8 && (

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                            <Button
                                onClick={onSubmit}
                                size="sm"
                                variant='light'
                                bg={isDark(bgColor) ? "#fff" : "#000"}
                                radius={'xl'}
                                style={{
                                    color: isDark(bgColor) ? "#000" : "#fff",
                                    fontWeight: 600,
                                    width: "150px",
                                    boxShadow: "0 0 16px 6px rgba(255,255,255,0.05), 4px 2px 8px rgba(0,0,0,0.2)",
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    )}

                    {!editor && (
                        <div className="absolute bottom-2 w-full text-center">
                            <a
                                href="https://projct.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold tracking-wide opacity-60 hover:opacity-100 transition"
                                style={{ color: isDark(bgColor) ? "#fff" : "#000" }}
                            >
                                {bottomText}
                            </a>
                        </div>
                    )}

                </div>
            </div >

            {/* Color Picker */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)
                }
                centered
                withCloseButton={false}
                zIndex={9999}
                padding="lg"
                radius="md"
                size="sm"
                overlayProps={{ blur: 3 }}
                transitionProps={{ transition: "fade", duration: 200 }}
            >
                <div className="flex justify-end">
                    <ActionIcon
                        variant='subtle'
                        onClick={() => { setModalOpened(false) }}
                        size="lg"
                        style={{ marginTop: -6, marginRight: -2 }}
                    >
                        <X size={20} />
                    </ActionIcon>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <h2 className="text-sm font-medium text-gray-500 mb-2">Background</h2>
                        <SimpleGrid cols={6} spacing="xs">
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color}
                                    className="w-9 h-9 cursor-pointer rounded-sm hover:scale-105 transition ring-offset-1 focus:outline-none"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: bgColor === color ? `0 0 0 2px #000` : undefined,
                                    }}
                                    onClick={() => {
                                        setBgColor(color);
                                        setModalOpened(false);
                                    }}
                                />
                            ))}
                        </SimpleGrid>
                    </div>

                    {/* Button Color */}
                    <div>
                        <h2 className="text-sm font-medium text-gray-500 mb-2">Button color</h2>
                        <SimpleGrid cols={4} spacing={8}>
                            {BUTTON_COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color}
                                    className="w-full aspect-square rounded-sm transition hover:scale-105 focus:outline-none"
                                    style={{
                                        height: 32,
                                        backgroundColor: color,
                                        boxShadow: buttonColor === color ? `0 0 0 2px #000` : undefined,
                                    }}
                                    onClick={() => {
                                        setButtonColor(color);
                                        setModalOpened(false);
                                    }}
                                />
                            ))}
                        </SimpleGrid>
                        <h2 className="text-sm font-medium text-gray-500 mb-2 mt-4">Button radius</h2>
                        <select
                            value={buttonRadius}
                            onChange={(e) => { setButtonRadius(e.target.value as typeof buttonRadius); setModalOpened(false); }}
                            className="w-full px-2 py-2 rounded-md text-xs font-mono transition border border-gray-300"
                        >
                            {BUTTON_RADIUS_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                    {r.toUpperCase()}
                                </option>
                            ))}
                        </select>





                        <h2 className="text-sm font-medium text-gray-500 mb-2 mt-4">Effect</h2>
                        <SimpleGrid cols={2} spacing={8}>
                            {cardEffects.map((eff) => (
                                <button
                                    key={eff}
                                    className={`w-full px-2 py-2 rounded-md text-xs font-mono transition border ${effect === eff ? "border-black ring-2 ring-black" : "border-gray-300"
                                        }`}
                                    onClick={() => {
                                        if (setEffect) {
                                            setEffect(eff);
                                        }
                                        setModalOpened(false);
                                    }}
                                >
                                    {eff.replace(/^animate-/, "").replace(/^static-/, "")}
                                </button>
                            ))}
                        </SimpleGrid>

                    </div>



                    {/* Git Contributions */}

                    {setShowGit && setGithubUsername &&
                        <div className="mt-6 pb-4">
                            <h2 className="text-sm font-medium text-gray-500 mb-2">Git Contributions</h2>
                            <Switch
                                checked={showGit}
                                onChange={(event) => setShowGit(event.currentTarget.checked)}
                                size="md"
                            />

                            <AnimatePresence>
                                {true && (
                                    <motion.div
                                        key="github-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="mt-4"
                                    >
                                        <TextInput
                                            label="GitHub username"
                                            value={githubUsername}
                                            onChange={(e) => setGithubUsername(e.currentTarget.value)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    }
                </div>
            </Modal >

            {/* Add/Edit Project Modal */}
            < Modal
                opened={newProjectModal}
                onClose={() => {
                    setNewProjectModal(false);
                    setEditingIndex(null);
                }}
                zIndex={9999}
                withCloseButton={false}
                fullScreen
                padding={0}
                transitionProps={{ transition: "fade", duration: 300 }}
            >
                <div className="h-full flex items-start justify-center pt-48 px-6">
                    <div className="w-full max-w-sm space-y-4">
                        <TextInput
                            label="Project title"
                            value={modalProject.title}
                            maxLength={22}
                            onChange={(e) =>
                                setModalProject({ ...modalProject, title: e.target.value })
                            }
                            inputMode="text"
                            type="text"
                            autoComplete="off"
                            styles={{ input: { fontSize: 16 } }}
                        />
                        <TextInput
                            label="Link"
                            value={modalProject.link}
                            maxLength={128}
                            onChange={(e) =>
                                setModalProject({ ...modalProject, link: e.target.value })
                            }
                            inputMode="url"
                            type="url"
                            autoComplete="off"
                            styles={{ input: { fontSize: 16 } }}
                        />
                        <Button
                            fullWidth
                            onClick={handleModalSave}
                            color="brand"
                            radius="xl"
                            size="md"
                        >
                            {editingIndex !== null ? "Save" : "Add"}
                        </Button>
                        <Button
                            variant='transparent'
                            color="gray"
                            fullWidth
                            onClick={() => setNewProjectModal(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal >
        </>
    );
}