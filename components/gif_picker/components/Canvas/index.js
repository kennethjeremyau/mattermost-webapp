import React, { Component } from 'react'
import GIF from 'gif.js'
import './Canvas.scss'

export default class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentColor: {
        red: 0, green: 0, blue: 0, css: 'rgb(0, 0, 0)'
      }
    }

    this.drawCommands = []
    this.coordinates = null
  }

  get canvasEl() {
    return this._canvasEl
  }

  set canvasEl(canvasEl) {
    if (this._canvasEl === canvasEl) {
      return
    }

    this._canvasEl = canvasEl
    if (canvasEl) {
      this.setupCanvas(canvasEl, canvasEl.offsetWidth, canvasEl.offsetHeight)
    }
  }

  set color(color) {
    this.setState({ currentColor: color })
  }

  get width() {
    return this.canvasEl && this.canvasEl.offsetWidth || 0
  }

  get height() {
    return this.canvasEl && this.canvasEl.offsetHeight || 0
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize)
  }

  clear() {
    this.drawCommands = []

    if (this.pencilEl) {
      this.pencilEl.style.visibility = 'visible'
      this.pencilEl.style.opacity = 1
    }

    const canvasEl = this.canvasEl
    if (canvasEl) {
      this.setupCanvas(canvasEl, canvasEl.offsetWidth, canvasEl.offsetHeight)
    }
  }

  createGIF(params) {
    const { height, fps, length, width } = params

    return new Promise((resolve, reject) => {
      const gif = new GIF({
        background: '#ffffff',
        height: height,
        quality: 8,
        width: width,
        workers: 2,
        workerScript: '/static/gif.worker.js'
      })

      gif.on('finished', function(blob) {
        resolve(blob)
      })

      const numCoordinates = this.drawCommands.reduce((acc, command) => {
        return acc + command.coordinates.length
      }, 0)
      const scale = width / this.canvasEl.width

      const canvasEl = document.createElement('canvas')
      this.setupCanvas(canvasEl, width, height, scale)

      let renderEvery = Math.max(1, numCoordinates / (length * fps))
      let currentFrame = 0
      let lastRenderedFrame

      const ctx = canvasEl.getContext("2d")
      this.replayDrawing(canvasEl, function() {
        if (Math.floor(currentFrame / renderEvery) !== lastRenderedFrame) {
          lastRenderedFrame = Math.floor(currentFrame / renderEvery)
          gif.addFrame(ctx, { copy: true, delay: 1000 / fps })
        }

        currentFrame++
      })

      gif.addFrame(ctx, { copy: true, delay: 1000 / fps })
      gif.addFrame(ctx, { copy: true, delay: 500 })

      gif.render()
    })
  }

  replayDrawing(canvasEl, frameCallback) {
    const ctx = canvasEl.getContext("2d")

    this.drawCommands.forEach(command => {
      ctx.strokeStyle = command.color
      ctx.shadowColor = command.color

      ctx.beginPath()
      command.coordinates.forEach(coordinate => {
        ctx.lineTo(coordinate.left * canvasEl.width, coordinate.top * canvasEl.height)
        ctx.stroke()

        if (frameCallback) {
          frameCallback()
        }
      })
    })
  }

  setupCanvas(canvasEl, width, height, scale) {
    scale = scale || 1

    canvasEl.width = width
    canvasEl.height = height

    const ctx = canvasEl.getContext("2d")
    ctx.lineWidth = 7 * scale
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.fillStyle = "#ffffff"
    ctx.shadowBlur = 1
    ctx.fillRect(0, 0, width, height)
  }

  beginDraw = (e)=>{
    e.stopPropagation()

    if (this.pencilEl) {
      this.pencilEl.style.visibility = 'hidden'
      this.pencilEl.style.opacity = 0
    }

    this.coordinates = []
    const currentColor = this.state.currentColor
    this.drawCommands.push({
      color: currentColor.css,
      coordinates: this.coordinates
    })

    const ctx = this.canvasEl.getContext("2d")
    ctx.strokeStyle = currentColor.css
    ctx.shadowColor = currentColor.css
    ctx.beginPath()

    this.draw(e)
  }

  endDraw = (e)=>{
    e.stopPropagation()

    this.coordinates = null
  }

  draw = (e)=>{
    e.preventDefault()
    e.stopPropagation()

    if (!this.canvasEl || !this.coordinates) {
      return
    }

    const rect = this.canvasEl.getBoundingClientRect()
    let left, top
    if (e.clientX !== undefined && e.clientY !== undefined) {
      left = e.clientX - rect.left
      top = e.clientY - rect.top
    } else if (e.touches !== undefined) {
      left = e.touches[0].clientX - rect.left
      top = e.touches[0].clientY - rect.top
    }

    const relativeLeft = left / rect.width
    const relativeTop = top / rect.height

    this.coordinates.push({ left: relativeLeft, top: relativeTop })

    const ctx = this.canvasEl.getContext("2d")
    ctx.lineTo(left, top)
    // This is a little hack to add support for dots appearing when the user
    // taps.
    if (this.coordinates.length == 1) {
      this.coordinates.push({ left: relativeLeft + 1 / rect.width, top: relativeTop })
      ctx.lineTo(left + 1, top)
    }
    ctx.stroke()

    if (this.props.onUpdate) {
      this.props.onUpdate()
    }
  }

  updateSize = () => {
    if (!this.canvasEl) {
      return
    }

    this.setupCanvas(this.canvasEl, this.canvasEl.offsetWidth, this.canvasEl.offsetHeight)
    this.replayDrawing(this.canvasEl)

    if (this.props.onUpdate) {
      this.props.onUpdate()
    }
  }

  render() {
    return (
      <div className="canvas"
          onMouseDown={this.beginDraw}
          onMouseUp={this.endDraw}
          onMouseMove={this.draw}
          onTouchStart={this.beginDraw}
          onTouchEnd={this.endDraw}
          onTouchMove={this.draw}>
        <canvas
          className="content"
          ref={el => this.canvasEl = el} />
        <i className="canvas-border ic-canvas-border" />
        <i className="pencil ic-pencil"
            ref={el => this.pencilEl = el}  />
      </div>
    )
  }
}
