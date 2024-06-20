import type {Meta, StoryObj} from '@storybook/react';
import AppWithRedux from "../AppWithRedux";
import {Provider} from "react-redux";
import {store} from "../state/store";
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";

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

export const AppWithReduxStory: Story = {}
