import { mount } from '@vue/test-utils';
import BaseRadioButtons from '@/components/Admin/Modules/Button/BaseRadioButtons.vue';

const factory = (propsData) => {
  return mount(BaseRadioButtons, {
    propsData: {
      ...propsData,
    },
  });
};

describe('BaseRadioButtons', () => {
  it('input要素、label要素がレンダリングされている', () => {
    const wrapper = factory({
      id: 'radio1',
      value: 'value1',
      label: 'label1',
      name: 'test-radio',
      checked: true,
    });

    expect(wrapper.find('input[type="radio"]').exists()).toBe(true);
    expect(wrapper.find('label').exists()).toBe(true);
  });

  it('ラジオボタンが選択されている', () => {
    const wrapper = factory({
      id: 'radio1',
      value: 'value1',
      label: 'label1',
      name: 'test-radio',
      checked: true,
    });

    const radioInput = wrapper.find('input[type="radio"]');

    expect(radioInput.element.checked).toBe(true);
  });

  it('ラジオボタンが選択されていない', () => {
    const wrapper = factory({
      id: 'radio2',
      value: 'value2',
      label: 'label2',
      name: 'test-radio',
      checked: false,
    });

    const radioInput = wrapper.find('input[type="radio"]');

    expect(radioInput.element.checked).toBe(false);
  });

  it('propsが正しく渡されているか', () => {
    const wrapper = factory({
      id: 'radio1',
      value: 'value1',
      label: 'label1',
      name: 'test-radio',
      checked: true,
    });

    expect(wrapper.props().id).toBe('radio1');
    expect(wrapper.props().value).toBe('value1');
    expect(wrapper.props().label).toBe('label1');
    expect(wrapper.props().name).toBe('test-radio');
    expect(wrapper.props().checked).toBe(true);
  });

  it('未選択のラジオボタンを選択済みにする', async () => {
    const wrapper = factory({
      id: 'radio1',
      value: 'value1',
      label: 'label1',
      name: 'test-radio',
      checked: false,
    });

    const radioInput = wrapper.find('input[type="radio"]');
    radioInput.trigger('change');

    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted().change[0]).toEqual(['value1']);
  });
});
