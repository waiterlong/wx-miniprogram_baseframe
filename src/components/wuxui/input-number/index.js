import baseComponent from '../helpers/baseComponent'
import classNames from '../helpers/classNames'

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1

const toNumberWhenUserInput = (num) => {
    if (/\.\d*0$/.test(num) || num.length > 16) {
        return num
    }

    if (isNaN(num)) {
        return num
    }

    return Number(num)
}

const getValidValue = (value, min, max) => {
    let val = parseFloat(value)

    if (isNaN(val)) {
        return value
    }

    if (val < min) {
        val = min
    }

    if (val > max) {
        val = max
    }

    return val
}

const defaultEvents = {
    onChange() {},
    onFocus() {},
    onBlur() {},
}

baseComponent({
    useEvents: true,
    defaultEvents,
    externalClasses: ['wux-sub-class', 'wux-input-class', 'wux-add-class'],
    relations: {
        '../field/index': {
            type: 'ancestor',
        },
    },
    properties: {
        prefixCls: {
            type: String,
            value: 'wux-input-number',
        },
        shape: {
            type: String,
            value: 'square',
        },
        min: {
            type: Number,
            value: -MAX_SAFE_INTEGER,
        },
        max: {
            type: Number,
            value: MAX_SAFE_INTEGER,
        },
        step: {
            type: Number,
            value: 1,
        },
        defaultValue: {
            type: Number,
            value: 0,
        },
        value: {
            type: Number,
            value: 0,
            observer(newVal) {
                if (this.data.controlled) {
                    this.setValue(newVal, false)
                }
            },
        },
        disabled: {
            type: Boolean,
            value: true,
        },
        longpress: {
            type: Boolean,
            value: false,
        },
        color: {
            type: String,
            value: 'balanced',
        },
        controlled: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        inputValue: 0,
        disabledMin: false,
        disabledMax: false,
    },
    computed: {
        classes: ['prefixCls, shape, color, disabledMin, disabledMax', function(prefixCls, shape, color, disabledMin, disabledMax) {
            const wrap = classNames(prefixCls, {
                [`${prefixCls}--${shape}`]: shape,
            })
            const sub = classNames(`${prefixCls}__selector`, {
                [`${prefixCls}__selector--sub`]: true,
                [`${prefixCls}__selector--${color}`]: color,
                [`${prefixCls}__selector--disabled`]: disabledMin,
            })
            const add = classNames(`${prefixCls}__selector`, {
                [`${prefixCls}__selector--add`]: true,
                [`${prefixCls}__selector--${color}`]: color,
                [`${prefixCls}__selector--disabled`]: disabledMax,
            })
            const icon = `${prefixCls}__icon`
            const input = `${prefixCls}__input`

            return {
                wrap,
                sub,
                add,
                icon,
                input,
            }
        }],
    },
    observers: {
        inputValue(newVal) {
            const { min, max } = this.data
            const disabledMin = newVal <= min
            const disabledMax = newVal >= max

            this.setData({
                disabledMin,
                disabledMax,
            })
        },
    },
    methods: {
        /**
         * 更新值
         */
        updated(inputValue) {
            if (this.hasFieldDecorator) return
            if (this.data.inputValue !== inputValue) {
                this.setData({ inputValue })
            }
        },
        /**
         * 设置值
         */
        setValue(value, runCallbacks = true) {
            const { min, max } = this.data
            const inputValue = getValidValue(value, min, max)

            this.updated(inputValue)

            if (runCallbacks) {
                this.emitEvent('change', { value: inputValue })
            }
        },
        /**
         * 数字计算函数
         */
        calculation(type, isLoop) {
            const {
                disabledMax,
                disabledMin,
                inputValue,
                step,
                longpress,
                controlled,
            } = this.data

            // add
            if (type === 'add') {
                if (disabledMax) return
                this.setValue(inputValue + step)
            }

            // sub
            if (type === 'sub') {
                if (disabledMin) return
                this.setValue(inputValue - step)
            }

            // longpress
            if (longpress && isLoop) {
                this.timeout = setTimeout(() => this.calculation(type, isLoop), 100)
            }
        },
        /**
         * 当键盘输入时，触发 input 事件
         */
        onInput(e) {
            this.clearInputTimer()
            this.inputTime = setTimeout(() => {
                const value = toNumberWhenUserInput(e.detail.value)
                this.setValue(value)
            }, 300)
        },
        /**
         * 输入框聚焦时触发
         */
        onFocus(e) {
            this.emitEvent('focus', e.detail)
        },
        /**
         * 输入框失去焦点时触发
         */
        onBlur(e) {
            // always set input value same as value
            this.setData({
                inputValue: this.data.inputValue,
            })

            this.emitEvent('blur', e.detail)
        },
        /**
         * 手指触摸后，超过350ms再离开
         */
        onLongpress(e) {
            const { type } = e.currentTarget.dataset
            const { longpress } = this.data
            if (longpress) {
                this.calculation(type, true)
            }
        },
        /**
         * 手指触摸后马上离开
         */
        onTap(e) {
            const { type } = e.currentTarget.dataset
            const { longpress } = this.data
            if (!longpress || longpress && !this.timeout) {
                this.calculation(type, false)
            }
        },
        /**
         *  手指触摸动作结束
         */
        onTouchEnd() {
            this.clearTimer()
        },
        /**
         * 手指触摸动作被打断，如来电提醒，弹窗
         */
        onTouchCancel() {
            this.clearTimer()
        },
        /**
         * 清除长按的定时器
         */
        clearTimer() {
            if (this.timeout) {
                clearTimeout(this.timeout)
                this.timeout = null
            }
        },
        /**
         * 清除输入框的定时器
         */
        clearInputTimer() {
            if (this.inputTime) {
                clearTimeout(this.inputTime)
                this.inputTime = null
            }
        },
    },
    attached() {
        const { defaultValue, value, controlled } = this.data
        const inputValue = controlled ? value : defaultValue

        this.setValue(inputValue, false)
    },
    detached() {
        this.clearTimer()
        this.clearInputTimer()
    },
})
