
export interface ModelDefinition {
    id: string;
    name: string;
    description?: string;
    file: string;
    thumbnail?: string;
}

// All GLB models are served via the /api/models/:filename proxy on the Express server.
// This bypasses CORS restrictions that block direct CDN access from the browser.
const PROXY = '/api/models';

export const PRESET_MODELS: ModelDefinition[] = [
    {
        id: 'oversize-hoodie',
        name: 'Oversize Hoodie',
        description: 'Streetwear oversize fit hoodie',
        file: `${PROXY}/oversize-hoodie.glb`,
    },
    {
        id: 'sweatshirt',
        name: 'Sweatshirt',
        description: 'Classic crewneck sweatshirt',
        file: `${PROXY}/sweatshirt.glb`,
    },
    {
        id: 'tshirt-normal',
        name: 'T-Shirt',
        description: 'Standard Fit T-Shirt',
        file: `${PROXY}/tshirt-normal.glb`,
    },
    {
        id: 'raglan-tshirt',
        name: 'Raglan T-Shirt',
        description: 'T-Shirt with raglan cut sleeves',
        file: `${PROXY}/raglan-tshirt.glb`,
    },
    {
        id: 'soccer-uniform',
        name: 'Soccer Uniform',
        description: 'Full soccer kit with jersey and shorts',
        file: `${PROXY}/soccer-uniform.glb`,
    },
    {
        id: 'basketball-uniform',
        name: 'Basketball Uniform',
        description: 'Complete basketball jersey and shorts set',
        file: `${PROXY}/basketball-uniform.glb`,
    },
    {
        id: 'american-football',
        name: 'American Football Uniform',
        description: 'Full American football jersey and pants set',
        file: `${PROXY}/american-football.glb`,
    },
    {
        id: 'trouser',
        name: 'Fleece Trousers',
        description: 'Comfortable fleece trousers',
        file: `${PROXY}/trouser.glb`,
    },
];
