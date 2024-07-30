import type {Meta, StoryObj} from '@storybook/react';
import AppWithRedux from "./AppWithRedux";
import {ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator";

const meta: Meta<typeof AppWithRedux> = {
    title: 'TODOLISTS/AppWithRedux',
    component: AppWithRedux,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [ReduxStoreProviderDecorator]
};

export default meta;

/*type Story = StoryObj<typeof AppWithRedux>;*/
type Story = StoryObj<typeof meta>;

/*export const AppWithReduxStory: Story = {}*/
export const AppWithReduxStory = (props: any) => {
    return (<AppWithRedux demo={true} />)
}

