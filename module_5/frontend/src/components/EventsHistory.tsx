import { useSuiClientQueries } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Badge, Grid } from "@radix-ui/themes";
import { useNetworkVariable } from "../networkConfig";
import { RefreshProps } from "../types/props";

export default function EventsHistory({ refreshKey }: RefreshProps) {
  const packageId = useNetworkVariable("packageId");

  const eventQueries = useSuiClientQueries({
    queries: [
      {
        method: "queryEvents",
        params: {
          query: {
            MoveEventType: `${packageId}::hero::HeroListed`
          },
          limit: 20,
          order: "descending"
        },
        queryKey: ["queryEvents", packageId, "HeroListed", refreshKey],
        enabled: !!packageId,
      },
      {
        method: "queryEvents",
        params: {
          query: {
            MoveEventType: `${packageId}::hero::HeroBought`
          },
          limit: 20,
          order: "descending"
        },
        queryKey: ["queryEvents", packageId, "HeroBought", refreshKey],
        enabled: !!packageId,
      }
    ]
  });

  const [listedEventsQuery, boughtEventsQuery] = eventQueries;
  const listedEvents = listedEventsQuery.data;
  const boughtEvents = boughtEventsQuery.data;
  const isListedPending = listedEventsQuery.isPending;
  const isBoughtPending = boughtEventsQuery.isPending;
  const hasListedError = listedEventsQuery.error;
  const hasBoughtError = boughtEventsQuery.error;

  const formatTimestamp = (timestamp: string) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price: string) => {
    return (Number(price) / 1_000_000_000).toFixed(2);
  };

  if (isListedPending || isBoughtPending) {
    return (
      <Flex direction="column" gap="4">
        <Heading size="6">Recent Events</Heading>
        <Card>
          <Text>Loading events history...</Text>
        </Card>
      </Flex>
    );
  }

  if (hasListedError || hasBoughtError) {
    return (
      <Flex direction="column" gap="4">
        <Heading size="6">Recent Events</Heading>
        <Card>
          <Text color="red">Error loading events: {hasListedError?.message || hasBoughtError?.message}</Text>
        </Card>
      </Flex>
    );
  }

  const allEvents = [
    ...(listedEvents?.data || []).map(event => ({
      ...event,
      type: 'listed' as const
    })),
    ...(boughtEvents?.data || []).map(event => ({
      ...event,
      type: 'bought' as const
    }))
  ].sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs));

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Recent Events ({allEvents.length})</Heading>
      
      {allEvents.length === 0 ? (
        <Card>
          <Text>No events found</Text>
        </Card>
      ) : (
        <Grid columns="1" gap="3">
          {allEvents.map((event, index) => {
            const eventData = event.parsedJson as any;
            
            if (!eventData) return null;
            
            return (
              <Card key={`${event.id.txDigest}-${index}`} style={{ padding: "16px" }}>
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="3">
                    <Badge color={event.type === 'listed' ? 'blue' : 'green'} size="2">
                      {event.type === 'listed' ? 'Hero Listed' : 'Hero Bought'}
                    </Badge>
                    {event.timestampMs && (
                      <Text size="3" color="gray">
                        {formatTimestamp(event.timestampMs)}
                      </Text>
                    )}
                  </Flex>
                  
                  <Flex align="center" gap="4" wrap="wrap">
                    {eventData.price && (
                      <Text size="3">
                        <strong>Price:</strong> {formatPrice(eventData.price)} SUI
                      </Text>
                    )}
                    
                    {event.type === 'listed' ? (
                      eventData.seller && (
                        <Text size="3">
                          <strong>Seller:</strong> {formatAddress(eventData.seller)}
                        </Text>
                      )
                    ) : (
                      <Flex gap="4">
                        {eventData.buyer && (
                          <Text size="3">
                            <strong>Buyer:</strong> {formatAddress(eventData.buyer)}
                          </Text>
                        )}
                        {eventData.seller && (
                          <Text size="3">
                            <strong>Seller:</strong> {formatAddress(eventData.seller)}
                          </Text>
                        )}
                      </Flex>
                    )}
                    
                    {eventData.id && (
                      <Text size="3" color="gray" style={{ fontFamily: "monospace" }}>
                        ID: {eventData.id.slice(0, 8)}...
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}
