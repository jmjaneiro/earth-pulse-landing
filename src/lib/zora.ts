import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'https://api.zora.co/graphql';

const client = new GraphQLClient(endpoint);

export const getZoraTokens = async () => {
    // Check if we should use mock data
    if (process.env.MOCK_ZORA_API === 'true') {
        return getMockTokens();
    }

    const creatorAddress = process.env.ZORA_CREATOR_ADDRESS || '0x...'; // Replace with a default or throw

    const query = gql`
        query GetTokens($where: TokenInput!) {
            tokens(where: $where, sort: { sortKey: MINTED, sortDirection: DESC }, pagination: { limit: 12 }) {
                nodes {
                    token {
                        collectionAddress
                        tokenId
                        name
                        description
                        image {
                            url
                        }
                        mintInfo {
                            mintContext {
                                blockTimestamp
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const data = await client.request(query, {
            where: {
                collectionAddresses: [creatorAddress]
            }
        });

        const nodes = data?.tokens?.nodes;
        if (!nodes || nodes.length === 0) {
            console.log('No Zora tokens found, returning mock data fallback.');
            return getMockTokens().slice(0, 3);
        }

        return nodes;
    } catch (error) {
        console.error('Error fetching Zora tokens, returning mock data fallback:', error);
        return getMockTokens().slice(0, 3);
    }
};

const getMockTokens = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        token: {
            collectionAddress: '0x1234567890abcdef',
            tokenId: `${i + 1}`,
            name: `Earth Pulse Region ${i + 1}`,
            description: `High-resolution ReFi satellite imagery of region ${i + 1}, capturing vital ecological data.📍 Location: Amazon Rainforest sector ${i + 1}`,
            image: {
                // Return a placeholder image tailored to satellite ReFi aesthetic
                url: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800`
            }
        }
    }));
};
