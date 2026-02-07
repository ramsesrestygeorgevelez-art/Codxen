import { Scene, Entity } from '../core/Entity';
import { Transform3D } from '../core/components';
import { Vector3 } from '../core/Math';

export interface WebGLRenderOptions {
    width: number;
    height: number;
    clearColor?: [number, number, number, number];
    fov?: number;
}

/**
 * Simple 3D WebGL Renderer
 */
export class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private options: WebGLRenderOptions;
    private shaderProgram: WebGLProgram | null = null;
    private projectionMatrix: Float32Array;
    private viewMatrix: Float32Array;

    constructor(containerId: string, options: WebGLRenderOptions) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = options.width;
        this.canvas.height = options.height;
        container.appendChild(this.canvas);

        const gl = this.canvas.getContext('webgl');
        if (!gl) {
            throw new Error('Could not initialize WebGL');
        }

        this.gl = gl;
        this.options = options;

        // Initialize WebGL
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(...(options.clearColor || [0.1, 0.1, 0.1, 1]));
        this.gl.enable(this.gl.DEPTH_TEST);

        // Set up matrices
        this.projectionMatrix = this.createProjectionMatrix(
            options.fov || 45,
            this.canvas.width / this.canvas.height,
            0.1,
            100
        );
        this.viewMatrix = this.createIdentityMatrix();

        // Create shader program
        this.createShaderProgram();
    }

    /**
     * Create projection matrix (perspective)
     */
    private createProjectionMatrix(fov: number, aspect: number, near: number, far: number): Float32Array {
        const matrix = new Float32Array(16);
        const f = 1 / Math.tan(fov * Math.PI / 360);
        const rangeInv = 1 / (near - far);

        matrix[0] = f / aspect;
        matrix[5] = f;
        matrix[10] = (near + far) * rangeInv;
        matrix[11] = -1;
        matrix[14] = near * far * rangeInv * 2;

        return matrix;
    }

    /**
     * Create identity matrix
     */
    private createIdentityMatrix(): Float32Array {
        const matrix = new Float32Array(16);
        matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1;
        return matrix;
    }

    /**
     * Create shader program
     */
    private createShaderProgram(): void {
        const vertexShaderSource = `
            attribute vec3 aVertexPosition;
            attribute vec3 aVertexColor;

            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying lowp vec4 vColor;

            void main(void) {
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
                vColor = vec4(aVertexColor, 1.0);
            }
        `;

        const fragmentShaderSource = `
            varying lowp vec4 vColor;

            void main(void) {
                gl_FragColor = vColor;
            }
        `;

        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

        const program = this.gl.createProgram();
        if (!program) throw new Error('Failed to create shader program');

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error('Failed to link shader program');
        }

        this.shaderProgram = program;
    }

    /**
     * Compile a shader
     */
    private compileShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) throw new Error('Failed to create shader');

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Shader compilation failed');
        }

        return shader;
    }

    /**
     * Render a scene
     */
    render(scene: Scene): void {
        // Clear canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        if (!this.shaderProgram) return;

        // Use shader program
        this.gl.useProgram(this.shaderProgram);

        // Set uniforms
        const projLoc = this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        const viewLoc = this.gl.getUniformLocation(this.shaderProgram, 'uViewMatrix');

        this.gl.uniformMatrix4fv(projLoc, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(viewLoc, false, this.viewMatrix);

        // Render all entities
        const entities = this.getAllEntities(scene.getEntities());
        for (const entity of entities) {
            if (entity.active) {
                this.renderEntity(entity);
            }
        }
    }

    /**
     * Get all entities including children
     */
    private getAllEntities(entities: Entity[]): Entity[] {
        const result: Entity[] = [];
        for (const entity of entities) {
            result.push(entity);
            result.push(...this.getAllEntities(entity.getChildren()));
        }
        return result;
    }

    /**
     * Render a single entity
     */
    private renderEntity(entity: Entity): void {
        const transform = entity.getComponent(Transform3D);
        if (!transform || !this.shaderProgram) return;

        // Create model matrix
        const modelMatrix = this.createModelMatrix(transform);

        // Set model matrix uniform
        const modelLoc = this.gl.getUniformLocation(this.shaderProgram, 'uModelMatrix');
        this.gl.uniformMatrix4fv(modelLoc, false, modelMatrix);

        // Draw a simple cube for now
        this.drawCube();
    }

    /**
     * Create model matrix from transform
     */
    private createModelMatrix(transform: Transform3D): Float32Array {
        const matrix = this.createIdentityMatrix();

        // Translation
        matrix[12] = transform.position.x;
        matrix[13] = transform.position.y;
        matrix[14] = transform.position.z;

        // Scale
        matrix[0] = transform.scale.x;
        matrix[5] = transform.scale.y;
        matrix[10] = transform.scale.z;

        return matrix;
    }

    /**
     * Draw a simple cube
     */
    private drawCube(): void {
        if (!this.shaderProgram) return;

        const vertices = [
            // Front face
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
            // Back face
            -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
            // Top face
            -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
            // Bottom face
            -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
            // Right face
            1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
            // Left face
            -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
        ];

        const colors = [
            ...Array(4).fill([1, 0, 0]),
            ...Array(4).fill([0, 1, 0]),
            ...Array(4).fill([0, 0, 1]),
            ...Array(4).fill([1, 1, 0]),
            ...Array(4).fill([1, 0, 1]),
            ...Array(4).fill([0, 1, 1]),
        ].flat();

        const indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        const positionAttrib = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.gl.enableVertexAttribArray(positionAttrib);
        this.gl.vertexAttribPointer(positionAttrib, 3, this.gl.FLOAT, false, 0, 0);

        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        const colorAttrib = this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
        this.gl.enableVertexAttribArray(colorAttrib);
        this.gl.vertexAttribPointer(colorAttrib, 3, this.gl.FLOAT, false, 0, 0);

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Get canvas
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Resize canvas
     */
    resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
        this.options.width = width;
        this.options.height = height;
    }
}
