(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/forms'], factory) :
	(factory((global['ng2-dnd'] = {}),global.ng.core,global.ng.forms));
}(this, (function (exports,core,forms) { 'use strict';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
/**
 * Check and return true if an object is type of string
 * @param {?} obj
 * @return {?}
 */
function isString(obj) {
    return typeof obj === "string";
}
/**
 * Check and return true if an object not undefined or null
 * @param {?} obj
 * @return {?}
 */
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
/**
 * Check and return true if an object is type of Function
 * @param {?} obj
 * @return {?}
 */
function isFunction(obj) {
    return typeof obj === "function";
}
/**
 * Create Image element with specified url string
 * @param {?} src
 * @return {?}
 */
function createImage(src) {
    var /** @type {?} */ img = new HTMLImageElement();
    img.src = src;
    return img;
}
/**
 * Call the function
 * @param {?} fun
 * @return {?}
 */
function callFun(fun) {
    return fun();
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
var DataTransferEffect = /** @class */ (function () {
    /**
     * @param {?} name
     */
    function DataTransferEffect(name) {
        this.name = name;
    }
    return DataTransferEffect;
}());
DataTransferEffect.COPY = new DataTransferEffect('copy');
DataTransferEffect.LINK = new DataTransferEffect('link');
DataTransferEffect.MOVE = new DataTransferEffect('move');
DataTransferEffect.NONE = new DataTransferEffect('none');
var DragImage = /** @class */ (function () {
    /**
     * @param {?} imageElement
     * @param {?=} x_offset
     * @param {?=} y_offset
     */
    function DragImage(imageElement, x_offset, y_offset) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        this.imageElement = imageElement;
        this.x_offset = x_offset;
        this.y_offset = y_offset;
        if (isString(this.imageElement)) {
            // Create real image from string source
            var /** @type {?} */ imgScr = (this.imageElement);
            this.imageElement = new HTMLImageElement();
            ((this.imageElement)).src = imgScr;
        }
    }
    return DragImage;
}());
var DragDropConfig = /** @class */ (function () {
    function DragDropConfig() {
        this.onDragStartClass = "dnd-drag-start";
        this.onDragEnterClass = "dnd-drag-enter";
        this.onDragOverClass = "dnd-drag-over";
        this.onSortableDragClass = "dnd-sortable-drag";
        this.dragEffect = DataTransferEffect.MOVE;
        this.dropEffect = DataTransferEffect.MOVE;
        this.dragCursor = "move";
        this.defaultCursor = "pointer";
    }
    return DragDropConfig;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
/**
 * @abstract
 */
var AbstractComponent = /** @class */ (function () {
    /**
     * @param {?} elemRef
     * @param {?} _dragDropService
     * @param {?} _config
     * @param {?} _cdr
     */
    function AbstractComponent(elemRef, _dragDropService, _config, _cdr) {
        var _this = this;
        this._dragDropService = _dragDropService;
        this._config = _config;
        this._cdr = _cdr;
        /**
         * Whether the object is draggable. Default is true.
         */
        this._dragEnabled = false;
        /**
         * Allows drop on this element
         */
        this.dropEnabled = false;
        this.dropZones = [];
        this.cloneItem = false;
        // Assign default cursor unless overridden
        this._defaultCursor = _config.defaultCursor;
        this._elem = elemRef.nativeElement;
        this._elem.style.cursor = this._defaultCursor; // set default cursor on our element
        //
        // DROP events
        //
        this._elem.ondragenter = function (event) {
            _this._onDragEnter(event);
        };
        this._elem.ondragover = function (event) {
            _this._onDragOver(event);
            //
            if (event.dataTransfer != null) {
                event.dataTransfer.dropEffect = _this._config.dropEffect.name;
            }
            return false;
        };
        this._elem.ondragleave = function (event) {
            _this._onDragLeave(event);
        };
        this._elem.ondrop = function (event) {
            _this._onDrop(event);
        };
        //
        // Drag events
        //
        this._elem.addEventListener('mousedown', function (event) {
            _this._target = event.target;
        }, false);
        this._elem.addEventListener('dragstart', function (event) {
            if (_this._dragHandle) {
                if (!_this._dragHandle.contains(/** @type {?} */ (_this._target))) {
                    event.preventDefault();
                    return;
                }
            }
            if (_this._dragDropService.firstDragData) {
                // process only first element in hierarhy
                return;
            }
            _this._onDragStart(event);
            _this._dragDropService.firstDragData = _this._dragDropService.dragData;
            //
            if (event.dataTransfer != null) {
                event.dataTransfer.setData('text', '');
                // Change drag effect
                event.dataTransfer.effectAllowed = _this.effectAllowed || _this._config.dragEffect.name;
                // Change drag image
                if (isPresent(_this.dragImage)) {
                    if (isString(_this.dragImage)) {
                        ((event.dataTransfer)).setDragImage(createImage(/** @type {?} */ (_this.dragImage)));
                    }
                    else if (isFunction(_this.dragImage)) {
                        ((event.dataTransfer)).setDragImage(callFun(/** @type {?} */ (_this.dragImage)));
                    }
                    else {
                        var /** @type {?} */ img = (_this.dragImage);
                        ((event.dataTransfer)).setDragImage(img.imageElement, img.x_offset, img.y_offset);
                    }
                }
                else if (isPresent(_this._config.dragImage)) {
                    var /** @type {?} */ dragImage = _this._config.dragImage;
                    ((event.dataTransfer)).setDragImage(dragImage.imageElement, dragImage.x_offset, dragImage.y_offset);
                }
                else if (_this.cloneItem) {
                    _this._dragHelper = /** @type {?} */ (_this._elem.cloneNode(true));
                    _this._dragHelper.classList.add('dnd-drag-item');
                    _this._dragHelper.style.position = "absolute";
                    _this._dragHelper.style.top = "0px";
                    _this._dragHelper.style.left = "-1000px";
                    _this._elem.parentElement.appendChild(_this._dragHelper);
                    ((event.dataTransfer)).setDragImage(_this._dragHelper, event.offsetX, event.offsetY);
                }
                // Change drag cursor
                var /** @type {?} */ cursorelem = (_this._dragHandle) ? _this._dragHandle : _this._elem;
                if (_this._dragEnabled) {
                    cursorelem.style.cursor = _this.effectCursor ? _this.effectCursor : _this._config.dragCursor;
                }
                else {
                    cursorelem.style.cursor = _this._defaultCursor;
                }
            }
        });
        this._elem.addEventListener('dragend', function (event) {
            if (_this._elem.parentElement && _this._dragHelper) {
                _this._elem.parentElement.removeChild(_this._dragHelper);
            }
            _this._onDragEnd(event);
            // Restore style of dragged element
            var /** @type {?} */ cursorelem = (_this._dragHandle) ? _this._dragHandle : _this._elem;
            cursorelem.style.cursor = _this._defaultCursor;
            _this._dragDropService.firstDragData = null;
        });
    }
    Object.defineProperty(AbstractComponent.prototype, "dragEnabled", {
        /**
         * @return {?}
         */
        get: function () {
            return this._dragEnabled;
        },
        /**
         * @param {?} enabled
         * @return {?}
         */
        set: function (enabled) {
            this._dragEnabled = !!enabled;
            this._elem.draggable = this._dragEnabled;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} elem
     * @return {?}
     */
    AbstractComponent.prototype.setDragHandle = function (elem) {
        this._dragHandle = elem;
    };
    /**
     * **** Change detection *****
     * @return {?}
     */
    AbstractComponent.prototype.detectChanges = function () {
        var _this = this;
        // Programmatically run change detection to fix issue in Safari
        setTimeout(function () {
            if (_this._cdr && !((_this._cdr)).destroyed) {
                _this._cdr.detectChanges();
            }
        }, 250);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragEnter = function (event) {
        // console.log('ondragenter._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed(event)) {
            // event.preventDefault();
            this._onDragEnterCallback(event);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragOver = function (event) {
        // // console.log('ondragover._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed(event)) {
            // The element is over the same source element - do nothing
            if (event.preventDefault) {
                // Necessary. Allows us to drop.
                event.preventDefault();
            }
            this._onDragOverCallback(event);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragLeave = function (event) {
        // console.log('ondragleave._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed(event)) {
            // event.preventDefault();
            this._onDragLeaveCallback(event);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDrop = function (event) {
        // console.log('ondrop._isDropAllowed', this._isDropAllowed);
        if (this._isDropAllowed(event)) {
            // Necessary. Allows us to drop.
            this._preventAndStop(event);
            this._onDropCallback(event);
            this.detectChanges();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._isDropAllowed = function (event) {
        if ((this._dragDropService.isDragged || (event.dataTransfer && event.dataTransfer.files)) && this.dropEnabled) {
            // First, if `allowDrop` is set, call it to determine whether the
            // dragged element can be dropped here.
            if (this.allowDrop) {
                return this.allowDrop(this._dragDropService.dragData);
            }
            // Otherwise, use dropZones if they are set.
            if (this.dropZones.length === 0 && this._dragDropService.allowedDropZones.length === 0) {
                return true;
            }
            for (var /** @type {?} */ i = 0; i < this._dragDropService.allowedDropZones.length; i++) {
                var /** @type {?} */ dragZone = this._dragDropService.allowedDropZones[i];
                if (this.dropZones.indexOf(dragZone) !== -1) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._preventAndStop = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragStart = function (event) {
        //console.log('ondragstart.dragEnabled', this._dragEnabled);
        if (this._dragEnabled) {
            this._dragDropService.allowedDropZones = this.dropZones;
            // console.log('ondragstart.allowedDropZones', this._dragDropService.allowedDropZones);
            this._onDragStartCallback(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragEnd = function (event) {
        this._dragDropService.allowedDropZones = [];
        // console.log('ondragend.allowedDropZones', this._dragDropService.allowedDropZones);
        this._onDragEndCallback(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragEnterCallback = function (event) { };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragOverCallback = function (event) { };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragLeaveCallback = function (event) { };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDropCallback = function (event) { };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragStartCallback = function (event) { };
    /**
     * @param {?} event
     * @return {?}
     */
    AbstractComponent.prototype._onDragEndCallback = function (event) { };
    return AbstractComponent;
}());
AbstractComponent.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
AbstractComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: core.ChangeDetectorRef, },
]; };
var AbstractHandleComponent = /** @class */ (function () {
    /**
     * @param {?} elemRef
     * @param {?} _dragDropService
     * @param {?} _config
     * @param {?} _Component
     * @param {?} _cdr
     */
    function AbstractHandleComponent(elemRef, _dragDropService, _config, _Component, _cdr) {
        this._dragDropService = _dragDropService;
        this._config = _config;
        this._Component = _Component;
        this._cdr = _cdr;
        this._elem = elemRef.nativeElement;
        this._Component.setDragHandle(this._elem);
    }
    return AbstractHandleComponent;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
var SortableContainer = /** @class */ (function (_super) {
    __extends(SortableContainer, _super);
    /**
     * @param {?} elemRef
     * @param {?} dragDropService
     * @param {?} config
     * @param {?} cdr
     * @param {?} _sortableDataService
     */
    function SortableContainer(elemRef, dragDropService, config, cdr, _sortableDataService) {
        var _this = _super.call(this, elemRef, dragDropService, config, cdr) || this;
        _this._sortableDataService = _sortableDataService;
        _this._sortableData = [];
        _this.dragEnabled = false;
        return _this;
    }
    Object.defineProperty(SortableContainer.prototype, "draggable", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dragEnabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortableContainer.prototype, "sortableData", {
        /**
         * @return {?}
         */
        get: function () {
            return this._sortableData;
        },
        /**
         * @param {?} sortableData
         * @return {?}
         */
        set: function (sortableData) {
            this._sortableData = sortableData;
            if (sortableData instanceof forms.FormArray) {
                this.sortableHandler = new SortableFormArrayHandler();
            }
            else {
                this.sortableHandler = new SortableArrayHandler();
            }
            //
            this.dropEnabled = !!this._sortableData;
            // console.log("collection is changed, drop enabled: " + this.dropEnabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortableContainer.prototype, "dropzones", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dropZones = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortableContainer.prototype, "allowdrop", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.allowDrop = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    SortableContainer.prototype._onDragEnterCallback = function (event) {
        if (this._sortableDataService.isDragged) {
            var /** @type {?} */ item = this._sortableDataService.sortableContainer.getItemAt(this._sortableDataService.index);
            // Check does element exist in sortableData of this Container
            if (this.indexOf(item) === -1) {
                // Let's add it
                // console.log('Container._onDragEnterCallback. drag node [' + this._sortableDataService.index.toString() + '] over parent node');
                // Remove item from previouse list
                this._sortableDataService.sortableContainer.removeItemAt(this._sortableDataService.index);
                if (this._sortableDataService.sortableContainer._sortableData.length === 0) {
                    this._sortableDataService.sortableContainer.dropEnabled = true;
                }
                // Add item to new list
                this.insertItemAt(item, 0);
                this._sortableDataService.sortableContainer = this;
                this._sortableDataService.index = 0;
            }
            // Refresh changes in properties of container component
            this.detectChanges();
        }
    };
    /**
     * @param {?} index
     * @return {?}
     */
    SortableContainer.prototype.getItemAt = function (index) {
        return this.sortableHandler.getItemAt(this._sortableData, index);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    SortableContainer.prototype.indexOf = function (item) {
        return this.sortableHandler.indexOf(this._sortableData, item);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    SortableContainer.prototype.removeItemAt = function (index) {
        this.sortableHandler.removeItemAt(this._sortableData, index);
    };
    /**
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    SortableContainer.prototype.insertItemAt = function (item, index) {
        this.sortableHandler.insertItemAt(this._sortableData, item, index);
    };
    return SortableContainer;
}(AbstractComponent));
SortableContainer.decorators = [
    { type: core.Directive, args: [{ selector: '[dnd-sortable-container]' },] },
];
/** @nocollapse */
SortableContainer.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: core.ChangeDetectorRef, },
    { type: DragDropSortableService, },
]; };
SortableContainer.propDecorators = {
    "draggable": [{ type: core.Input, args: ["dragEnabled",] },],
    "sortableData": [{ type: core.Input },],
    "dropzones": [{ type: core.Input, args: ["dropZones",] },],
    "allowdrop": [{ type: core.Input, args: ["allowDrop",] },],
};
var SortableArrayHandler = /** @class */ (function () {
    function SortableArrayHandler() {
    }
    /**
     * @param {?} sortableData
     * @param {?} index
     * @return {?}
     */
    SortableArrayHandler.prototype.getItemAt = function (sortableData, index) {
        return sortableData[index];
    };
    /**
     * @param {?} sortableData
     * @param {?} item
     * @return {?}
     */
    SortableArrayHandler.prototype.indexOf = function (sortableData, item) {
        return sortableData.indexOf(item);
    };
    /**
     * @param {?} sortableData
     * @param {?} index
     * @return {?}
     */
    SortableArrayHandler.prototype.removeItemAt = function (sortableData, index) {
        sortableData.splice(index, 1);
    };
    /**
     * @param {?} sortableData
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    SortableArrayHandler.prototype.insertItemAt = function (sortableData, item, index) {
        sortableData.splice(index, 0, item);
    };
    return SortableArrayHandler;
}());
var SortableFormArrayHandler = /** @class */ (function () {
    function SortableFormArrayHandler() {
    }
    /**
     * @param {?} sortableData
     * @param {?} index
     * @return {?}
     */
    SortableFormArrayHandler.prototype.getItemAt = function (sortableData, index) {
        return sortableData.at(index);
    };
    /**
     * @param {?} sortableData
     * @param {?} item
     * @return {?}
     */
    SortableFormArrayHandler.prototype.indexOf = function (sortableData, item) {
        return sortableData.controls.indexOf(item);
    };
    /**
     * @param {?} sortableData
     * @param {?} index
     * @return {?}
     */
    SortableFormArrayHandler.prototype.removeItemAt = function (sortableData, index) {
        sortableData.removeAt(index);
    };
    /**
     * @param {?} sortableData
     * @param {?} item
     * @param {?} index
     * @return {?}
     */
    SortableFormArrayHandler.prototype.insertItemAt = function (sortableData, item, index) {
        sortableData.insert(index, item);
    };
    return SortableFormArrayHandler;
}());
var SortableComponent = /** @class */ (function (_super) {
    __extends(SortableComponent, _super);
    /**
     * @param {?} elemRef
     * @param {?} dragDropService
     * @param {?} config
     * @param {?} _sortableContainer
     * @param {?} _sortableDataService
     * @param {?} cdr
     */
    function SortableComponent(elemRef, dragDropService, config, _sortableContainer, _sortableDataService, cdr) {
        var _this = _super.call(this, elemRef, dragDropService, config, cdr) || this;
        _this._sortableContainer = _sortableContainer;
        _this._sortableDataService = _sortableDataService;
        /**
         * Callback function called when the drag action ends with a valid drop action.
         * It is activated after the on-drop-success callback
         */
        _this.onDragSuccessCallback = new core.EventEmitter();
        _this.onDragStartCallback = new core.EventEmitter();
        _this.onDragOverCallback = new core.EventEmitter();
        _this.onDragEndCallback = new core.EventEmitter();
        _this.onDropSuccessCallback = new core.EventEmitter();
        _this.dropZones = _this._sortableContainer.dropZones;
        _this.dragEnabled = true;
        _this.dropEnabled = true;
        return _this;
    }
    Object.defineProperty(SortableComponent.prototype, "draggable", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dragEnabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortableComponent.prototype, "droppable", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dropEnabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortableComponent.prototype, "effectallowed", {
        /**
         * Drag allowed effect
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.effectAllowed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortableComponent.prototype, "effectcursor", {
        /**
         * Drag effect cursor
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.effectCursor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    SortableComponent.prototype._onDragStartCallback = function (event) {
        // console.log('_onDragStartCallback. dragging elem with index ' + this.index);
        this._sortableDataService.isDragged = true;
        this._sortableDataService.sortableContainer = this._sortableContainer;
        this._sortableDataService.index = this.index;
        this._sortableDataService.markSortable(this._elem);
        // Add dragData
        this._dragDropService.isDragged = true;
        this._dragDropService.dragData = this.dragData;
        this._dragDropService.onDragSuccessCallback = this.onDragSuccessCallback;
        //
        this.onDragStartCallback.emit(this._dragDropService.dragData);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SortableComponent.prototype._onDragOverCallback = function (event) {
        if (this._sortableDataService.isDragged && this._elem !== this._sortableDataService.elem) {
            // console.log('_onDragOverCallback. dragging elem with index ' + this.index);
            this._sortableDataService.sortableContainer = this._sortableContainer;
            this._sortableDataService.index = this.index;
            this._sortableDataService.markSortable(this._elem);
            this.onDragOverCallback.emit(this._dragDropService.dragData);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SortableComponent.prototype._onDragEndCallback = function (event) {
        // console.log('_onDragEndCallback. end dragging elem with index ' + this.index);
        this._sortableDataService.isDragged = false;
        this._sortableDataService.sortableContainer = null;
        this._sortableDataService.index = null;
        this._sortableDataService.markSortable(null);
        // Add dragGata
        this._dragDropService.isDragged = false;
        this._dragDropService.dragData = null;
        this._dragDropService.onDragSuccessCallback = null;
        //
        this.onDragEndCallback.emit(this._dragDropService.dragData);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SortableComponent.prototype._onDragEnterCallback = function (event) {
        if (this._sortableDataService.isDragged) {
            this._sortableDataService.markSortable(this._elem);
            if ((this.index !== this._sortableDataService.index) ||
                (this._sortableDataService.sortableContainer.sortableData !== this._sortableContainer.sortableData)) {
                // console.log('Component._onDragEnterCallback. drag node [' + this.index + '] over node [' + this._sortableDataService.index + ']');
                // Get item
                var /** @type {?} */ item = this._sortableDataService.sortableContainer.getItemAt(this._sortableDataService.index);
                // Remove item from previouse list
                this._sortableDataService.sortableContainer.removeItemAt(this._sortableDataService.index);
                if (this._sortableDataService.sortableContainer.sortableData.length === 0) {
                    this._sortableDataService.sortableContainer.dropEnabled = true;
                }
                // Add item to new list
                this._sortableContainer.insertItemAt(item, this.index);
                if (this._sortableContainer.dropEnabled) {
                    this._sortableContainer.dropEnabled = false;
                }
                this._sortableDataService.sortableContainer = this._sortableContainer;
                this._sortableDataService.index = this.index;
                this.detectChanges();
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SortableComponent.prototype._onDropCallback = function (event) {
        if (this._sortableDataService.isDragged) {
            // console.log('onDropCallback.onDropSuccessCallback.dragData', this._dragDropService.dragData);
            this.onDropSuccessCallback.emit(this._dragDropService.dragData);
            if (this._dragDropService.onDragSuccessCallback) {
                // console.log('onDropCallback.onDragSuccessCallback.dragData', this._dragDropService.dragData);
                this._dragDropService.onDragSuccessCallback.emit(this._dragDropService.dragData);
            }
            // Refresh changes in properties of container component
            this._sortableContainer.detectChanges();
        }
    };
    return SortableComponent;
}(AbstractComponent));
SortableComponent.decorators = [
    { type: core.Directive, args: [{ selector: '[dnd-sortable]' },] },
];
/** @nocollapse */
SortableComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: SortableContainer, },
    { type: DragDropSortableService, },
    { type: core.ChangeDetectorRef, },
]; };
SortableComponent.propDecorators = {
    "index": [{ type: core.Input, args: ['sortableIndex',] },],
    "draggable": [{ type: core.Input, args: ["dragEnabled",] },],
    "droppable": [{ type: core.Input, args: ["dropEnabled",] },],
    "dragData": [{ type: core.Input },],
    "effectallowed": [{ type: core.Input, args: ["effectAllowed",] },],
    "effectcursor": [{ type: core.Input, args: ["effectCursor",] },],
    "onDragSuccessCallback": [{ type: core.Output, args: ["onDragSuccess",] },],
    "onDragStartCallback": [{ type: core.Output, args: ["onDragStart",] },],
    "onDragOverCallback": [{ type: core.Output, args: ["onDragOver",] },],
    "onDragEndCallback": [{ type: core.Output, args: ["onDragEnd",] },],
    "onDropSuccessCallback": [{ type: core.Output, args: ["onDropSuccess",] },],
};
var SortableHandleComponent = /** @class */ (function (_super) {
    __extends(SortableHandleComponent, _super);
    /**
     * @param {?} elemRef
     * @param {?} dragDropService
     * @param {?} config
     * @param {?} _Component
     * @param {?} cdr
     */
    function SortableHandleComponent(elemRef, dragDropService, config, _Component, cdr) {
        return _super.call(this, elemRef, dragDropService, config, _Component, cdr) || this;
    }
    return SortableHandleComponent;
}(AbstractHandleComponent));
SortableHandleComponent.decorators = [
    { type: core.Directive, args: [{ selector: '[dnd-sortable-handle]' },] },
];
/** @nocollapse */
SortableHandleComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: SortableComponent, },
    { type: core.ChangeDetectorRef, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
var DragDropData = /** @class */ (function () {
    function DragDropData() {
    }
    return DragDropData;
}());
/**
 * @return {?}
 */
function dragDropServiceFactory() {
    return new DragDropService();
}
var DragDropService = /** @class */ (function () {
    function DragDropService() {
        this.allowedDropZones = [];
    }
    return DragDropService;
}());
DragDropService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
DragDropService.ctorParameters = function () { return []; };
/**
 * @param {?} config
 * @return {?}
 */
function dragDropSortableServiceFactory(config) {
    return new DragDropSortableService(config);
}
var DragDropSortableService = /** @class */ (function () {
    /**
     * @param {?} _config
     */
    function DragDropSortableService(_config) {
        this._config = _config;
    }
    Object.defineProperty(DragDropSortableService.prototype, "elem", {
        /**
         * @return {?}
         */
        get: function () {
            return this._elem;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} elem
     * @return {?}
     */
    DragDropSortableService.prototype.markSortable = function (elem) {
        if (isPresent(this._elem)) {
            this._elem.classList.remove(this._config.onSortableDragClass);
        }
        if (isPresent(elem)) {
            this._elem = elem;
            this._elem.classList.add(this._config.onSortableDragClass);
        }
    };
    return DragDropSortableService;
}());
DragDropSortableService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
DragDropSortableService.ctorParameters = function () { return [
    { type: DragDropConfig, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
var DraggableComponent = /** @class */ (function (_super) {
    __extends(DraggableComponent, _super);
    /**
     * @param {?} elemRef
     * @param {?} dragDropService
     * @param {?} config
     * @param {?} cdr
     */
    function DraggableComponent(elemRef, dragDropService, config, cdr) {
        var _this = _super.call(this, elemRef, dragDropService, config, cdr) || this;
        /**
         * Callback function called when the drag actions happened.
         */
        _this.onDragStart = new core.EventEmitter();
        _this.onDragEnd = new core.EventEmitter();
        /**
         * Callback function called when the drag action ends with a valid drop action.
         * It is activated after the on-drop-success callback
         */
        _this.onDragSuccessCallback = new core.EventEmitter();
        _this._defaultCursor = _this._elem.style.cursor;
        _this.dragEnabled = true;
        return _this;
    }
    Object.defineProperty(DraggableComponent.prototype, "draggable", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dragEnabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableComponent.prototype, "dropzones", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dropZones = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableComponent.prototype, "effectallowed", {
        /**
         * Drag allowed effect
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.effectAllowed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableComponent.prototype, "effectcursor", {
        /**
         * Drag effect cursor
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.effectCursor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    DraggableComponent.prototype._onDragStartCallback = function (event) {
        this._dragDropService.isDragged = true;
        this._dragDropService.dragData = this.dragData;
        this._dragDropService.onDragSuccessCallback = this.onDragSuccessCallback;
        this._elem.classList.add(this._config.onDragStartClass);
        //
        this.onDragStart.emit({ dragData: this.dragData, mouseEvent: event });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DraggableComponent.prototype._onDragEndCallback = function (event) {
        this._dragDropService.isDragged = false;
        this._dragDropService.dragData = null;
        this._dragDropService.onDragSuccessCallback = null;
        this._elem.classList.remove(this._config.onDragStartClass);
        //
        this.onDragEnd.emit({ dragData: this.dragData, mouseEvent: event });
    };
    return DraggableComponent;
}(AbstractComponent));
DraggableComponent.decorators = [
    { type: core.Directive, args: [{ selector: '[dnd-draggable]' },] },
];
/** @nocollapse */
DraggableComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: core.ChangeDetectorRef, },
]; };
DraggableComponent.propDecorators = {
    "draggable": [{ type: core.Input, args: ["dragEnabled",] },],
    "onDragStart": [{ type: core.Output },],
    "onDragEnd": [{ type: core.Output },],
    "dragData": [{ type: core.Input },],
    "onDragSuccessCallback": [{ type: core.Output, args: ["onDragSuccess",] },],
    "dropzones": [{ type: core.Input, args: ["dropZones",] },],
    "effectallowed": [{ type: core.Input, args: ["effectAllowed",] },],
    "effectcursor": [{ type: core.Input, args: ["effectCursor",] },],
    "dragImage": [{ type: core.Input },],
    "cloneItem": [{ type: core.Input },],
};
var DraggableHandleComponent = /** @class */ (function (_super) {
    __extends(DraggableHandleComponent, _super);
    /**
     * @param {?} elemRef
     * @param {?} dragDropService
     * @param {?} config
     * @param {?} _Component
     * @param {?} cdr
     */
    function DraggableHandleComponent(elemRef, dragDropService, config, _Component, cdr) {
        return _super.call(this, elemRef, dragDropService, config, _Component, cdr) || this;
    }
    return DraggableHandleComponent;
}(AbstractHandleComponent));
DraggableHandleComponent.decorators = [
    { type: core.Directive, args: [{ selector: '[dnd-draggable-handle]' },] },
];
/** @nocollapse */
DraggableHandleComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: DraggableComponent, },
    { type: core.ChangeDetectorRef, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
var DroppableComponent = /** @class */ (function (_super) {
    __extends(DroppableComponent, _super);
    /**
     * @param {?} elemRef
     * @param {?} dragDropService
     * @param {?} config
     * @param {?} cdr
     */
    function DroppableComponent(elemRef, dragDropService, config, cdr) {
        var _this = _super.call(this, elemRef, dragDropService, config, cdr) || this;
        /**
         * Callback function called when the drop action completes correctly.
         * It is activated before the on-drag-success callback.
         */
        _this.onDropSuccess = new core.EventEmitter();
        _this.onDragEnter = new core.EventEmitter();
        _this.onDragOver = new core.EventEmitter();
        _this.onDragLeave = new core.EventEmitter();
        _this.dropEnabled = true;
        return _this;
    }
    Object.defineProperty(DroppableComponent.prototype, "droppable", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dropEnabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroppableComponent.prototype, "allowdrop", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.allowDrop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroppableComponent.prototype, "dropzones", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.dropZones = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroppableComponent.prototype, "effectallowed", {
        /**
         * Drag allowed effect
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.effectAllowed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroppableComponent.prototype, "effectcursor", {
        /**
         * Drag effect cursor
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.effectCursor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    DroppableComponent.prototype._onDragEnterCallback = function (event) {
        if (this._dragDropService.isDragged) {
            this._elem.classList.add(this._config.onDragEnterClass);
            this.onDragEnter.emit({ dragData: this._dragDropService.dragData, mouseEvent: event });
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DroppableComponent.prototype._onDragOverCallback = function (event) {
        if (this._dragDropService.isDragged) {
            this._elem.classList.add(this._config.onDragOverClass);
            this.onDragOver.emit({ dragData: this._dragDropService.dragData, mouseEvent: event });
        }
    };
    
    /**
     * @param {?} event
     * @return {?}
     */
    DroppableComponent.prototype._onDragLeaveCallback = function (event) {
        if (this._dragDropService.isDragged) {
            this._elem.classList.remove(this._config.onDragOverClass);
            this._elem.classList.remove(this._config.onDragEnterClass);
            this.onDragLeave.emit({ dragData: this._dragDropService.dragData, mouseEvent: event });
        }
    };
    
    /**
     * @param {?} event
     * @return {?}
     */
    DroppableComponent.prototype._onDropCallback = function (event) {
        var /** @type {?} */ dataTransfer = ((event)).dataTransfer;
        if (this._dragDropService.isDragged || (dataTransfer && dataTransfer.files)) {
            this.onDropSuccess.emit({ dragData: this._dragDropService.dragData, mouseEvent: event });
            if (this._dragDropService.onDragSuccessCallback) {
                this._dragDropService.onDragSuccessCallback.emit({ dragData: this._dragDropService.dragData, mouseEvent: event });
            }
            this._elem.classList.remove(this._config.onDragOverClass);
            this._elem.classList.remove(this._config.onDragEnterClass);
        }
    };
    return DroppableComponent;
}(AbstractComponent));
DroppableComponent.decorators = [
    { type: core.Directive, args: [{ selector: '[dnd-droppable]' },] },
];
/** @nocollapse */
DroppableComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DragDropService, },
    { type: DragDropConfig, },
    { type: core.ChangeDetectorRef, },
]; };
DroppableComponent.propDecorators = {
    "droppable": [{ type: core.Input, args: ["dropEnabled",] },],
    "onDropSuccess": [{ type: core.Output },],
    "onDragEnter": [{ type: core.Output },],
    "onDragOver": [{ type: core.Output },],
    "onDragLeave": [{ type: core.Output },],
    "allowdrop": [{ type: core.Input, args: ["allowDrop",] },],
    "dropzones": [{ type: core.Input, args: ["dropZones",] },],
    "effectallowed": [{ type: core.Input, args: ["effectAllowed",] },],
    "effectcursor": [{ type: core.Input, args: ["effectCursor",] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Copyright (C) 2016-2018 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd
var providers = [
    DragDropConfig,
    { provide: DragDropService, useFactory: dragDropServiceFactory },
    { provide: DragDropSortableService, useFactory: dragDropSortableServiceFactory, deps: [DragDropConfig] }
];
var DndModule = /** @class */ (function () {
    function DndModule() {
    }
    /**
     * @return {?}
     */
    DndModule.forRoot = function () {
        return {
            ngModule: DndModule,
            providers: providers
        };
    };
    return DndModule;
}());
DndModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [DraggableComponent, DraggableHandleComponent, DroppableComponent, SortableContainer, SortableComponent, SortableHandleComponent],
                exports: [DraggableComponent, DraggableHandleComponent, DroppableComponent, SortableContainer, SortableComponent, SortableHandleComponent],
            },] },
];
/** @nocollapse */
DndModule.ctorParameters = function () { return []; };

exports.providers = providers;
exports.DndModule = DndModule;
exports.AbstractComponent = AbstractComponent;
exports.AbstractHandleComponent = AbstractHandleComponent;
exports.DataTransferEffect = DataTransferEffect;
exports.DragImage = DragImage;
exports.DragDropConfig = DragDropConfig;
exports.DragDropData = DragDropData;
exports.dragDropServiceFactory = dragDropServiceFactory;
exports.DragDropService = DragDropService;
exports.dragDropSortableServiceFactory = dragDropSortableServiceFactory;
exports.DragDropSortableService = DragDropSortableService;
exports.DraggableComponent = DraggableComponent;
exports.DraggableHandleComponent = DraggableHandleComponent;
exports.DroppableComponent = DroppableComponent;
exports.SortableContainer = SortableContainer;
exports.SortableComponent = SortableComponent;
exports.SortableHandleComponent = SortableHandleComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-dnd.umd.js.map
