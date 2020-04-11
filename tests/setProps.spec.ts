import { defineComponent, h, computed } from 'vue'

import { mount } from '../src'

describe('setProps', () => {
  it('updates a primitive prop', async () => {
    const Foo = {
      props: ['foo'],
      template: '<div>{{ foo }}</div>'
    }
    const wrapper = mount(Foo, {
      props: {
        foo: 'foo'
      }
    })
    expect(wrapper.html()).toContain('foo')

    await wrapper.setProps({ foo: 'qux' })
    expect(wrapper.html()).toContain('qux')
  })

  it('updates a function prop', async () => {
    const Foo = {
      props: ['obj'],
      template: `
        <div>
          <div v-if="obj.foo()">foo</div>
        </div>
      `
    }
    const wrapper = mount(Foo, {
      props: {
        obj: {
          foo: () => true
        }
      }
    })
    expect(wrapper.html()).toContain('foo')

    await wrapper.setProps({ obj: { foo: () => false } })
    expect(wrapper.html()).not.toContain('foo')
  })

  it('sets component props, and updates DOM when props were not initially passed', async () => {
    const Foo = {
      props: ['foo'],
      template: `<div>{{ foo }}</div>`
    }
    const wrapper = mount(Foo)
    expect(wrapper.html()).not.toContain('foo')

    await wrapper.setProps({ foo: 'foo' })

    expect(wrapper.html()).toContain('foo')
  })

  it('triggers a watcher', async () => {
    const Foo = {
      props: ['foo'],
      data() {
        return {
          bar: 'original-bar'
        }
      },
      watch: {
        foo(val: string) {
          this.bar = val
        }
      },
      template: `<div>{{ bar }}</div>`
    }
    const wrapper = mount(Foo)
    expect(wrapper.html()).toContain('original-bar')

    await wrapper.setProps({ foo: 'updated-bar' })

    expect(wrapper.html()).toContain('updated-bar')
  })

  it('works with composition API', async () => {
    const Foo = defineComponent({
      props: {
        foo: { type: String }
      },
      setup(props) {
        const foobar = computed(() => `${props.foo}-bar`)
        return () =>
          h('div', `Foo is: ${props.foo}. Foobar is: ${foobar.value}`)
      }
    })
    const wrapper = mount(Foo, {
      props: {
        foo: 'foo'
      }
    })
    expect(wrapper.html()).toContain('Foo is: foo. Foobar is: foo-bar')

    await wrapper.setProps({ foo: 'qux' })

    expect(wrapper.html()).toContain('Foo is: qux. Foobar is: qux-bar')
  })
})
