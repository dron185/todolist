import type {Meta, StoryObj} from '@storybook/react';
import {fn} from "@storybook/test";
import {EditableSpan} from '../components/EditableSpan/EditableSpan';

const meta: Meta<typeof EditableSpan> = {
    title: 'TODOLISTS/EditableSpan',
    component: EditableSpan,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        oldTitle: 'HTML',
        updateTitle: fn()
    },
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;

export const EditableSpanStory: Story = {}
