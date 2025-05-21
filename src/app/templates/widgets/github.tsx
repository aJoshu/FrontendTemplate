import GitHubCalendar from 'react-github-calendar';
import { motion } from "framer-motion";

export default function GitHubWidget(props: { githubUsername?: string }) {
    if (!props.githubUsername) return null;

    const profileUrl = `https://github.com/${props.githubUsername}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-center text-[16px] mb-5 mt-2.5 w-full max-w-[280px] mx-auto"
        >
            <div className="w-full px-4 mt-4 flex justify-center">
                <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-[300px]"
                >
                    <div className="bg-white text-black rounded-md shadow-md p-3 w-full hover:opacity-90 transition">
                        <div className="font-semibold text-xs mb-2">Contributions</div>
                        <GitHubCalendar
                            username={props.githubUsername}
                            blockSize={10}
                            blockMargin={4}
                            hideTotalCount
                            hideColorLegend
                            fontSize={12}
                            colorScheme="light"
                        />
                    </div>
                </a>
            </div>
        </motion.div>
    );
}
