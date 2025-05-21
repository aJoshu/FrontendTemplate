"use client";

import {
  AppShell,
  Container,
  Title,
  Text,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Loader,
  Table,
  Box,
  Skeleton,
  Button,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { fetchUserCards } from "@/api/card/getUserCards";
import { getCardAnalytics } from "@/api/card/getCardAnalytics";
import Login from "../login/page";
import { useAuth } from "../context/AuthContext";
import { LOCAL_URL } from "@/constants/Network";

function groupByDay(viewsRaw: any[], range: string) {
  const views = Array.isArray(viewsRaw) ? viewsRaw : [];

  let days = 1;
  if (range === "7d") days = 7;
  if (range === "1m") days = 30;
  if (range === "3m") days = 90;

  return views
    .slice(-days)
    .map((v) => ({
      day: new Date(v.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      count: v.count,
    }));
}

function getTopClickedProjects(clicks: any[]) {
  const clickMap: Record<string, number> = {};
  for (const click of clicks) {
    const key = click.projectLink;
    clickMap[key] = (clickMap[key] || 0) + click.count;
  }

  return Object.entries(clickMap)
    .map(([projectLink, count]) => ({ projectLink, count }))
    .sort((a, b) => b.count - a.count);
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [cardId, setCardId] = useState('string');
  const [analytics, setAnalytics] = useState<{ views: any[]; clicks: any[] }>({ views: [], clicks: [] });
  const { user } = useAuth();
  const wasAuthenticated = typeof window !== "undefined" && localStorage.getItem("wasAuthenticated") === "true";

  useEffect(() => {
    (async () => {
      try {
        const cards = await fetchUserCards();
        if (!cards?.length) return;
        setCardId(cards[0].id);
        const analyticsData = await getCardAnalytics();
        console.log(cards[0].id)
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Analytics load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const data = useMemo(() => groupByDay(analytics.views, range), [analytics.views, range]);
  const totalViews = useMemo(() => data.reduce((acc, cur) => acc + cur.count, 0), [data]);
  const topProjects = useMemo(() => getTopClickedProjects(analytics.clicks), [analytics.clicks]);

  if (!user && !wasAuthenticated) {
    localStorage.setItem("redirectPath", "/analytics");
    return <Login />;
  }

  return (
    <Container size="sm" className="pt-24">
      <Title order={2} mb="lg" size={'md'}>
        Analytics
      </Title>

      {loading ? (
        <Stack gap="lg">
          <div className="flex flex-col md:flex-row gap-4">
            <Card radius="md" padding="lg" shadow="xs" className="flex-1">
              <Skeleton height={64} width="30%" radius="md" />
            </Card>

            <Card radius="md" padding="lg" shadow="xs" className="flex-1">
              <Skeleton height={64} width="100%" radius="md" />
            </Card>
          </div>

          <Card radius="md" padding="lg" shadow="xs">
            <Skeleton height={80} width="100%" radius="md" />
          </Card>
        </Stack>
      ) : (
        <Stack gap="lg">
          <div className="flex flex-col md:flex-row gap-4">
            <Card
              radius="md"
              padding="lg"
              shadow="xs"
              className="flex-1"
            >
              <Text size="xs" c="dimmed" mb={4}>
                Total Views
              </Text>
              <Text size="28px" fw={700} >
                {totalViews.toLocaleString()}
              </Text>
            </Card>

            <Card
              radius="md"
              padding="lg"
              shadow="xs"
              className="flex-1"
            >
              <Text size="xs" c="dimmed" mb={4}>
                Date Range
              </Text>
              <SegmentedControl
                fullWidth
                size="sm"
                value={range}
                onChange={setRange}
                data={[
                  { label: "24h", value: "24h" },
                  { label: "7d", value: "7d" },
                  { label: "1m", value: "1m" },
                  { label: "3m", value: "3m" },
                ]}
              />
            </Card>
          </div>


          {topProjects.length > 0 && (
            <Card radius="md" padding="lg" shadow="xs">
              <Text size="xs" c="dimmed" mb={4}>
                Link clicks ({range})
              </Text>
              <Table
                withTableBorder={false}
                withRowBorders={false}
                striped
              >
                <Table.Tbody>
                  {topProjects.map((proj) => (
                    <Table.Tr key={proj.projectLink}>
                      <Table.Td>
                        <a
                          href={proj.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-inherit"
                          style={{ textDecoration: "none", fontWeight: 600 }}
                        >
                          {proj.projectLink}
                        </a>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {proj.count.toLocaleString()}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          )}
          <Button
            c={'black'}
            mt={-8}
            onClick={() => window.open(`${LOCAL_URL}/${cardId}`, '_blank')}
            variant="transparent"
          >
            Preview card
          </Button>
        </Stack>
      )}
    </Container>
  );
}
