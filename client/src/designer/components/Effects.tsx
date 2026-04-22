import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

export const Effects: React.FC = () => {
    return (
        <EffectComposer enableNormalPass={false} multisampling={0}>
            {<Bloom
                intensity={0.5}
                luminanceThreshold={1.1}
                luminanceSmoothing={0.2}
                kernelSize={KernelSize.MEDIUM}
            /> as any}

            {<Vignette
                offset={0.3}
                darkness={0.4}
                eskil={false}
                blendFunction={BlendFunction.NORMAL}
            /> as any}
        </EffectComposer>
    );
};
