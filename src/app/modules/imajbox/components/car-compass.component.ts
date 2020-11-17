import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { CameraPositionType, Picture } from './../../../shared/models/'

@Component({
  selector: 'app-car-compass',
  template: `
    <svg
      width="755"
      height="810"
      viewBox="0 0 755 810"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-32 w-32"
    >
      <g filter="url(#filter0_b)" *ngIf="isFront" (click)="onClickCamera('front')">
        <path
          d="M378 0L447.282 120H308.718L378 0Z"
          [ngClass]="{ inactive: selected !== 'front', active: selected === 'front' }"
        />
        <path d="M309.584 119.5L378 1L446.416 119.5H309.584Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter1_b)" *ngIf="isFrontLeft" (click)="onClickCamera('front-left')">
        <path
          d="M94.1423 116.142L227.985 152.005L130.005 249.985L94.1423 116.142Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'front-left', active: selected === 'front-left' }"
        />
        <path d="M130.264 249.019L94.8494 116.849L227.019 152.264L130.264 249.019Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter2_b)" *ngIf="isLeft" (click)="onClickCamera('left')">
        <path
          d="M0 388L120 318.718L120 457.282L0 388Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'left', active: selected === 'left' }"
        />
        <path d="M119.5 456.416L1 388L119.5 319.584L119.5 456.416Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter3_b)" *ngIf="isRight" (click)="onClickCamera('right')">
        <path
          d="M755 388L635 457.282V318.718L755 388Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'right', active: selected === 'right' }"
        />
        <path d="M635.5 319.584L754 388L635.5 456.416V319.584Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter4_b)" *ngIf="isFrontRight" (click)="onClickCamera('front-right')">
        <path
          d="M661.279 116.142L625.416 249.985L527.436 152.005L661.279 116.142Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'front-right', active: selected === 'front-right' }"
        />
        <path d="M528.402 152.264L660.572 116.849L625.157 249.019L528.402 152.264Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter5_b)" *ngIf="isBack" (click)="onClickCamera('back')">
        <path
          d="M376 809.421L445.282 689.421H306.718L376 809.421Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'back', active: selected === 'back' }"
        />
        <path d="M307.584 689.921L376 808.421L444.416 689.921H307.584Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter6_b)" *ngIf="isBackLeft" (click)="onClickCamera('back-left')">
        <path
          d="M93.1423 693.279L226.985 657.416L129.005 559.437L93.1423 693.279Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'back-left', active: selected === 'back-left' }"
        />
        <path d="M129.264 560.403L93.8494 692.572L226.019 657.157L129.264 560.403Z" stroke="#27303F" />
      </g>
      <g filter="url(#filter7_b)" *ngIf="isBackRight" (click)="onClickCamera('back-right')">
        <path
          d="M660.279 693.279L624.416 559.437L526.436 657.416L660.279 693.279Z"
          fill="#B8E7E9"
          [ngClass]="{ inactive: selected !== 'back-right', active: selected === 'back-right' }"
        />
        <path d="M527.402 657.157L659.572 692.572L624.157 560.403L527.402 657.157Z" stroke="#27303F" />
      </g>
      <path
        [matTooltip]="'imajbox.car' | transloco"
        class="car"
        matTooltipPosition="above"
        d="M468.917 324.08L467.95 323.903L444.266 386.449L444.234 386.535V386.626V428.318V428.887L444.798 428.814L468.481 425.769L468.917 425.713V425.273V324.08ZM456.474 294.581L456.593 294.125L456.144 293.979C415.593 280.86 376.013 280.863 346.579 284.14C331.861 285.779 319.674 288.238 311.164 290.287C306.909 291.312 303.573 292.235 301.299 292.902C300.162 293.235 299.291 293.505 298.703 293.691C298.409 293.784 298.185 293.857 298.035 293.906C297.973 293.926 297.923 293.943 297.886 293.955H297.319L297.483 294.582L316.766 368.405L316.864 368.779H317.25H436.733H437.119L437.216 368.405L436.733 368.279C437.216 368.405 437.217 368.405 437.217 368.405L437.217 368.403L437.218 368.398L437.224 368.376L437.247 368.29L437.336 367.948L437.682 366.621L438.986 361.628C440.102 357.35 441.683 351.294 443.539 344.18C447.251 329.953 452.065 311.497 456.474 294.581ZM297.967 294.455V294.955C298.015 294.951 298.062 294.943 298.093 294.937L297.967 294.455ZM310.026 389.359V389.268L309.994 389.182L286.302 326.627L285.335 326.804V425.299V425.74L285.771 425.795L309.463 428.823L310.026 428.895V428.327V389.359ZM285.335 530.11V531.044L286.112 530.526L309.804 514.738L310.026 514.589V514.322V443.222V442.781L309.589 442.726L285.897 439.75L285.335 439.68V440.246V530.11ZM298.93 555.372L298.414 556.149H299.347H457.361H458.294L457.777 555.372L438.52 526.432L438.372 526.21H438.104H318.595H318.327L318.179 526.433L298.93 555.372ZM444.234 511.606V511.874L444.457 512.022L468.14 527.819L468.917 528.338V527.403V440.238V439.668L468.353 439.742L444.67 442.821L444.234 442.878V443.317V511.606ZM325.972 201.5H428.02C441.348 201.5 453.458 208.914 462.256 219.733C471.054 230.553 476.491 244.723 476.5 258.116V560.039C476.5 586.802 454.785 608.5 428.02 608.5H325.972C299.198 608.5 277.5 586.794 277.5 560.039V258.116C277.5 244.722 282.933 230.553 291.73 219.733C300.527 208.914 312.639 201.5 325.972 201.5Z"
        stroke="#27303F"
      />

      <defs>
        <filter
          id="filter0_b"
          x="304.718"
          y="-4"
          width="146.564"
          height="128"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter1_b"
          x="41.1523"
          y="63.1523"
          width="190.832"
          height="190.832"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter2_b"
          x="-4"
          y="314.718"
          width="128"
          height="146.564"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter3_b"
          x="631"
          y="314.718"
          width="128"
          height="146.564"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter4_b"
          x="523.437"
          y="63.1523"
          width="190.832"
          height="190.832"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter5_b"
          x="302.718"
          y="685.421"
          width="146.564"
          height="128"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter6_b"
          x="40.1523"
          y="555.437"
          width="190.832"
          height="190.832"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <filter
          id="filter7_b"
          x="522.437"
          y="555.437"
          width="190.832"
          height="190.832"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
      </defs>
    </svg>
  `,
  styles: [
    `
      .active {
        fill: #58c7cc !important;
        cursor: not-allowed;
      }

      .inactive {
        fill: #e2f5f6 !important;
        cursor: pointer;
      }

      .car {
        fill: #e2f5f6 !important;
        cursor: help;
      }
    `,
  ],
})
export class CarCompassComponent implements OnChanges {
  @Input() pictures: Picture[]
  @Input() selected: CameraPositionType
  @Output() camera = new EventEmitter<CameraPositionType>()

  isFront = false
  isBack = false
  isRight = false
  isLeft = false
  isFrontRight = false
  isFrontLeft = false
  isBackRight = false
  isBackLeft = false

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'pictures':
            this.pictures.map((picture) => {
              this.defineCameraPosition(picture)
            })
            break
        }
      }
    }
  }

  onClickCamera(type: CameraPositionType) {
    this.camera.emit(type)
  }

  private defineCameraPosition(picture: Picture) {
    switch (picture.camera) {
      case 'front':
        this.isFront = true
        break
      case 'back':
        this.isBack = true
        break
      case 'right':
        this.isRight = true
        break
      case 'left':
        this.isLeft = true
        break
      case 'front-right':
        this.isFrontRight = true
        break
      case 'front-left':
        this.isFrontLeft = true
        break
      case 'back-right':
        this.isBackRight = true
        break
      case 'back-left':
        this.isBackLeft = true
        break
      default:
        console.warn(`No Image available for ${picture}`)
    }
  }
}
