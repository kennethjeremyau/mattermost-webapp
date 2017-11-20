import React, { Component } from 'react'

import './ColorPicker.scss'

export default class ColorPicker extends Component {
  constructor(props) {
    super(props)

    this.backgroundColors = [
      {red: 0, green: 0, blue: 0},
      {red: 255, green: 0, blue: 0},
      {red: 255, green: 255, blue: 0},
      {red: 0, green: 255, blue: 0},
      {red: 100, green: 244, blue: 233},
      {red: 0, green: 0, blue: 255},
      {red: 217, green: 92, blue: 148},
      {red: 255, green: 255, blue: 255}
    ]

    const percentIncrement = 100 / (this.backgroundColors.length - 1)
    this.backgroundColors = this.backgroundColors.map((color, index) => {
      return {
        color,
        percent: index * percentIncrement
      }
    })
  }

  toCSSColor(color) {
    return `rgb(${color.red}, ${color.green}, ${color.blue})`
  }

  blendColors(color1, color2, percent) {
    return {
      red: Math.round(color1.red + (color2.red - color1.red) * percent),
      green: Math.round(color1.green + (color2.green - color1.green) * percent),
      blue: Math.round(color1.blue + (color2.blue - color1.blue) * percent)
    }
  }

  generateBackgroundGradient(cssFunctionName) {
    const colors = this.backgroundColors.map(color => {
      return `${this.toCSSColor(color.color)} ${color.percent}%`
    })
    const cssArguments = ['left', ...colors]
    return `${cssFunctionName}(${cssArguments.join()})`
  }

  getColorFromPercent(percent) {
    for (let i = 0; i < this.backgroundColors.length - 1; i++) {
      const currentColor = this.backgroundColors[i]
      const nextColor = this.backgroundColors[i + 1]

      if (percent >= currentColor.percent &&
          percent <= nextColor.percent) {
        const relativePercent = (percent - currentColor.percent) /
          (nextColor.percent - currentColor.percent)
        return this.blendColors(currentColor.color, nextColor.color, relativePercent)
      }
    }

    return this.backgroundColors[this.backgroundColors.length - 1].color
  }

  selectColor(e) {
    const rect = this.colorPickerEl.getBoundingClientRect()
    const barRect = this.barEl.getBoundingClientRect()

    let left
    if (e.clientX !== undefined && e.clientY !== undefined) {
      left = e.clientX - rect.left
    } else if (e.touches !== undefined) {
      left = e.touches[0].clientX - rect.left
    }

    left = Math.max(60, Math.min(barRect.width + 60, left))
    this.sliderEl.style.left = `${left - 15}px`

    const newColor = this.getColorFromPercent((left - 60) / barRect.width * 100)
    this.sliderEl.style.backgroundColor = this.toCSSColor(newColor)
    if (this.props.onChangeColor) {
      this.props.onChangeColor(Object.assign({
        css: this.toCSSColor(newColor)
      }), newColor)
    }
  }



  beginDragSlider = (e)=>{
    e.stopPropagation()

    this.isDraggingSlider = true
    this.selectColor(e)
  }

  endDragSlider = (e)=>{
    e.stopPropagation()

    this.isDraggingSlider = false
  }

  dragSlider = (e)=>{
    e.preventDefault()
    e.stopPropagation()

    if (!this.isDraggingSlider) {
      return
    }
    this.selectColor(e)
  }

  clearDrawing = (e)=>{
    e.stopPropagation()

    if (this.props.clearDrawing &&
        window.confirm('Deleting your drawing GIF means it will be gone permanently.')) {
      this.props.clearDrawing()
    }
  }

  sendDrawing = (e)=>{
    e.stopPropagation()

    if (this.props.sendDrawing) {
      this.props.sendDrawing()
    }
  }

  renderClearButton() {
    return (
      <div className="trash-can-container"
          onMouseDown={this.clearDrawing}
          onTouchStart={this.clearDrawing}>
        <div className="ic-trash-can trash-can" />
      </div>
    )
  }

  renderSendButton() {
    const buttonClassNames = `ic-send-button send-button ${this.props.sending ? 'send-button-sending' : ''}`
    return (
      <div className='send-button-container'
        onMouseDown={this.sendDrawing}
        onTouchStart={this.sendDrawing}>
        <div className={buttonClassNames} />
      </div>
    )
  }

  render() {
    return (
      <div
          className="color-picker"
          onMouseDown={this.beginDragSlider}
          onMouseLeave={this.endDragSlider}
          onMouseMove={this.dragSlider}
          onTouchStart={this.beginDragSlider}
          onTouchMove={this.dragSlider}
          ref={el => this.colorPickerEl = el}>
        {this.renderClearButton()}
        <div
            className="bar"
            ref={el => this.barEl = el}
            style={{
              background: this.generateBackgroundGradient('-webkit-linear-gradient')
            }}/>
        <div
            className="slider"
            onMouseDown={this.beginDragSlider}
            onMouseUp={this.endDragSlider}
            onTouchStart={this.beginDragSlider}
            onTouchEnd={this.endDragSlider}
            ref={el => this.sliderEl = el} />
        {this.renderSendButton()}
      </div>
    )
  }
}
