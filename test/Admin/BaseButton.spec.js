import { mount } from '@vue/test-utils';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

describe('BaseButton', () => {
  it('renders a button', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.props().size).toBe('small'); // デフォルトでsize=small
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('test props', () => {
    const large = mount(BaseButton, {
      propsData: {
        size: 'large',
      },
    });
    expect(large.props().size).toBe('large');
  });

  it('test slot', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'my button',
      },
    });
    expect(wrapper.text()).toBe('my button');
  });

  it('click to be emitted', () => {
    const button = mount(BaseButton, {
      slots: {
        default: 'my button',
      },
    });
    button.trigger('click');
    expect(button.emitted().click).toBeTruthy();
  });

  it('disabledを渡すとボタンが無効になる', () => {
    const button = mount(BaseButton, {
      propsData: {
        disabled: true,
      },
    });

    button.trigger('click');
    expect(button.emitted().click).toBeFalsy();
  });
});
