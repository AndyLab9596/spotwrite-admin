import { mount } from '@vue/test-utils';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';

const factory = (propsData) => {
  return mount(BaseCheckbox, {
    propsData: {
      ...propsData,
    },
  });
};

describe('BaseCheckbox', () => {
  it('input要素、label要素がレンダリングされている', () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '1',
      label: 'label1',
    });

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
    expect(wrapper.find('label').exists()).toBe(true);
  });

  it('チェックボックスが選択されている', () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '2',
      label: 'label2',
    });

    const checkboxInput = wrapper.find('input[type="checkbox"]');

    expect(checkboxInput.element.checked).toBe(true);
  });

  it('チェックボックスが選択されていない', () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '3',
      label: 'label3',
    });

    const checkboxInput = wrapper.find('input[type="checkbox"]');

    expect(checkboxInput.element.checked).toBe(false);
  });

  it('propsが正しく渡されているか', () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '1',
      label: 'label1',
    });

    expect(wrapper.props().selectedValues).toEqual(['1', '2']);
    expect(wrapper.props().value).toBe('1');
    expect(wrapper.props().label).toBe('label1');
  });

  it('選択済みのチェックボックスを選択後に未選択になるか', async () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '1',
      label: 'label1',
    });

    const checkboxInput = wrapper.find('input[type="checkbox"]');
    await checkboxInput.setChecked(false);

    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted().change[0]).toEqual([['2']]);
  });

  it('未選択のチェックボックスを選択後に選択済みになるか', async () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '3',
      label: 'label3',
    });

    const checkboxInput = wrapper.find('input[type="checkbox"]');
    await checkboxInput.setChecked(true);

    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted().change[0]).toEqual([['1', '2', '3']]);
  });

  it('labelに渡したテキストが表示される', async () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '3',
      label: 'label',
    });

    const labelText = wrapper.find('.checkbox-text');
    expect(labelText.exists()).toBe(true);
    expect(labelText.text()).toBe('label');
  });

  it('labelにテキストを渡さなければテキストを表示しない', () => {
    const wrapper = factory({
      selectedValues: ['1', '2'],
      value: '3',
    });

    const labelText = wrapper.find('.checkbox-text');
    expect(labelText.exists()).toBe(true);
    expect(labelText.text()).toBe('');
  });

  it('disabled付与でチェックできなくなる', async () => {
    const wrapper = factory({
      disabled: true,
      selectedValues: [],
      value: '1',
      label: 'label',
    });

    const checkboxInput = wrapper.find('input[type="checkbox"]');
    await checkboxInput.setChecked(true);

    expect(wrapper.emitted().change).toBeFalsy();
  });
});
