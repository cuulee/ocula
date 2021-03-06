import * as d3 from '../../d3';

import {
    objectMerge,
    stringUniqueId
} from '@ocula/utilities';

export interface IChartOptions {
    padding?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    },
    classes?: {
        svg?: string;
        canvas?: string;
    },
    animation?: {
        duration?: number;
    }
}

export default abstract class Chart<T extends IChartOptions = IChartOptions> {

    protected id: string;
    protected element: Element;
    protected options: T;
    protected rendering: boolean;

    protected width: number;
    protected height: number;

    protected svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    protected canvas: d3.Selection<SVGGElement, unknown, null, undefined>;

    constructor(element: Element) {
        this.id = stringUniqueId();
        this.element = element;

        this.width = 0;
        this.height = 0;
        
        this.svg = d3.select(this.element)
            .append('svg')
            .attr('id', `chart-${this.id}`)
            .attr('width', '100%')
            .attr('height', '100%')
            .style('display', 'block');

        this.canvas = this.svg.append('g');
    }

    protected get defaultOptions(): IChartOptions {
        return {
            classes: {
                svg: 'chart',
                canvas: 'chart__canvas'
            },
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            },
            animation: {
                duration: 1000
            }
        };
    }

    protected bootstrap(options: T) {
        this.options = objectMerge(this.defaultOptions, options);

        const {
            width,
            height
        } = this.element.getBoundingClientRect();

        const {
            top,
            left,
            bottom,
            right
        } = this.options.padding;

        this.width = width - (left + right);
        this.height = height - (top + bottom);

        this.svg.classed(this.options.classes.svg, true)
            .attr('viewBox', `0 0 ${width} ${height}`);

        this.canvas.classed(this.options.classes.canvas, true)
            .attr('transform', `translate(${left}, ${top})`);
    }

    protected reset() {
        this.canvas.selectAll('*').remove();
    }

}