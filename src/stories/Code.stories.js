import 'tailwindcss/tailwind.css'
import Code from '../components/Code.vue'

export default {
  title: '组件/验证码',
  component: Code,
  argTypes: {
    color: { control: 'color', defaultValue: 'rgba(255, 255, 255, .6)' }
  }
}

const Template = (args) => ({
  components: { Code },
  setup() {
    return { args }
  },
  template: `<Code v-bind="args" v-slot="{ show }">
    <button class="w-[278px] h-[50px] rounded text-white block text-sm select-none bg-blue-500 hover:bg-blue-600" @click="show">验证</button>
  </Code>`
})

export const 滑块验证 = Template.bind({})