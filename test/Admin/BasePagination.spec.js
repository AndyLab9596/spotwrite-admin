import { mount } from '@vue/test-utils';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';

const factory = (payload) => {
  return mount(BasePagination, {
    propsData: {
      value: payload,
    },
  });
};

describe('BasePagination', () => {
  it('renders a pagination', () => {
    const pagination = {
      number: 1,
      offset: 0,
      limit: 20,
      total: 100,
    };

    const wrapper = factory(pagination);

    expect(wrapper.find('.pagination').exists()).toBe(true);

    // ボタン部分のレンダリングテスト
    const pageButtons = wrapper.findAll('.page-number');
    expect(pageButtons.length).toBe(
      Math.ceil(pagination.total / pagination.limit)
    );
    const handleButtons = wrapper.findAll('.page-handle');
    expect(handleButtons.length).toBe(4);
  });

  it('click second page button', () => {
    const pagination = {
      number: 1,
      offset: 0,
      limit: 20,
      total: 100,
    };

    const wrapper = factory(pagination);

    const secondPageButton = wrapper.findAll('.page-number').at(1);
    secondPageButton.trigger('click');

    expect(wrapper.emitted('input')).toBeTruthy();
    expect(wrapper.emitted('input')[0]).toEqual([
      {
        number: 2,
        offset: 20,
        limit: 20,
        total: 100,
      },
    ]);

    expect(wrapper.emitted('go-to-page')).toBeTruthy();
    expect(wrapper.emitted('go-to-page')[0]).toEqual([2]);
  });

  it('click [<] button', () => {
    const wrapper = factory({
      number: 2,
      offset: 20,
      limit: 20,
      total: 100,
    });

    const jumpToPrevPageButton = wrapper.findAll('.page-handle').at(0);
    jumpToPrevPageButton.trigger('click');

    expect(wrapper.emitted('input')).toBeTruthy();
    expect(wrapper.emitted('input')[0]).toEqual([
      {
        number: 1,
        offset: 0,
        limit: 20,
        total: 100,
      },
    ]);

    expect(wrapper.emitted('go-to-page')).toBeTruthy();
    expect(wrapper.emitted('go-to-page')[0]).toEqual([1]);
  });

  it('click [>] button', () => {
    const wrapper = factory({
      number: 1,
      offset: 0,
      limit: 20,
      total: 100,
    });

    const jumpToNextPageButton = wrapper.findAll('.page-handle').at(3);
    jumpToNextPageButton.trigger('click');

    expect(wrapper.emitted('input')).toBeTruthy();
    expect(wrapper.emitted('input')[0]).toEqual([
      {
        number: 2,
        offset: 20,
        limit: 20,
        total: 100,
      },
    ]);

    expect(wrapper.emitted('go-to-page')).toBeTruthy();
    expect(wrapper.emitted('go-to-page')[0]).toEqual([2]);
  });

  it('click [<<] button', () => {
    const wrapper = factory({
      number: 5,
      offset: 80,
      limit: 20,
      total: 100,
    });

    const jumpToFirstPageButton = wrapper.findAll('.page-handle').at(1);
    jumpToFirstPageButton.trigger('click');

    expect(wrapper.emitted('input')).toBeTruthy();
    expect(wrapper.emitted('input')[0]).toEqual([
      {
        number: 1,
        offset: 0,
        limit: 20,
        total: 100,
      },
    ]);

    expect(wrapper.emitted('go-to-page')).toBeTruthy();
    expect(wrapper.emitted('go-to-page')[0]).toEqual([1]);
  });

  it('click [>>] button', () => {
    const wrapper = factory({
      number: 1,
      offset: 0,
      limit: 20,
      total: 100,
    });

    const jumpToLastPageButton = wrapper.findAll('.page-handle').at(2);
    jumpToLastPageButton.trigger('click');

    expect(wrapper.emitted('input')).toBeTruthy();
    expect(wrapper.emitted('input')[0]).toEqual([
      {
        number: 5,
        offset: 80,
        limit: 20,
        total: 100,
      },
    ]);

    expect(wrapper.emitted('go-to-page')).toBeTruthy();
    expect(wrapper.emitted('go-to-page')[0]).toEqual([5]);
  });
});
