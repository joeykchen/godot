const GDSPX_HAS_BIG_INT64 = typeof DataView.prototype.getBigInt64 === 'function';
const GDSPX_UTF8_ENCODER = new TextEncoder();
const GDSPX_UTF8_DECODER = new TextDecoder("utf-8");

let gdspxFunctionPointerModule = null;
let gdspxMalloc = null;
let gdspxFree = null;
let gdspxAllocArray = null;
let gdspxAllocBool = null;
let gdspxAllocColor = null;
let gdspxAllocFloat = null;
let gdspxAllocInt = null;
let gdspxAllocObj = null;
let gdspxAllocRect2 = null;
let gdspxAllocString = null;
let gdspxAllocVec2 = null;
let gdspxAllocVec3 = null;
let gdspxAllocVec4 = null;
let gdspxFreeArray = null;
let gdspxFreeBool = null;
let gdspxFreeColor = null;
let gdspxFreeCstr = null;
let gdspxFreeFloat = null;
let gdspxFreeInt = null;
let gdspxFreeObj = null;
let gdspxFreeRect2 = null;
let gdspxFreeString = null;
let gdspxFreeVec2 = null;
let gdspxFreeVec3 = null;
let gdspxFreeVec4 = null;
let gdspxGetString = null;
let gdspxGetStringLen = null;
let gdspxNewBool = null;
let gdspxNewColor = null;
let gdspxNewFloat = null;
let gdspxNewInt = null;
let gdspxNewObj = null;
let gdspxNewRect2 = null;
let gdspxNewString = null;
let gdspxNewVec2 = null;
let gdspxNewVec3 = null;
let gdspxNewVec4 = null;
let gdspxToGdArray = null;
let gdspxToGdArrayRaw = null;
let gdspxToJsArray = null;

function EnsureGdspxFunctionPointers() {
    if (gdspxFunctionPointerModule === Module) {
        return;
    }
    gdspxMalloc = Module._cmalloc;
    gdspxFree = Module._cfree;
    gdspxAllocArray = Module._gdspx_alloc_array;
    gdspxAllocBool = Module._gdspx_alloc_bool;
    gdspxAllocColor = Module._gdspx_alloc_color;
    gdspxAllocFloat = Module._gdspx_alloc_float;
    gdspxAllocInt = Module._gdspx_alloc_int;
    gdspxAllocObj = Module._gdspx_alloc_obj;
    gdspxAllocRect2 = Module._gdspx_alloc_rect2;
    gdspxAllocString = Module._gdspx_alloc_string;
    gdspxAllocVec2 = Module._gdspx_alloc_vec2;
    gdspxAllocVec3 = Module._gdspx_alloc_vec3;
    gdspxAllocVec4 = Module._gdspx_alloc_vec4;
    gdspxFreeArray = Module._gdspx_free_array;
    gdspxFreeBool = Module._gdspx_free_bool;
    gdspxFreeColor = Module._gdspx_free_color;
    gdspxFreeCstr = Module._gdspx_free_cstr;
    gdspxFreeFloat = Module._gdspx_free_float;
    gdspxFreeInt = Module._gdspx_free_int;
    gdspxFreeObj = Module._gdspx_free_obj;
    gdspxFreeRect2 = Module._gdspx_free_rect2;
    gdspxFreeString = Module._gdspx_free_string;
    gdspxFreeVec2 = Module._gdspx_free_vec2;
    gdspxFreeVec3 = Module._gdspx_free_vec3;
    gdspxFreeVec4 = Module._gdspx_free_vec4;
    gdspxGetString = Module._gdspx_get_string;
    gdspxGetStringLen = Module._gdspx_get_string_len;
    gdspxNewBool = Module._gdspx_new_bool;
    gdspxNewColor = Module._gdspx_new_color;
    gdspxNewFloat = Module._gdspx_new_float;
    gdspxNewInt = Module._gdspx_new_int;
    gdspxNewObj = Module._gdspx_new_obj;
    gdspxNewRect2 = Module._gdspx_new_rect2;
    gdspxNewString = Module._gdspx_new_string;
    gdspxNewVec2 = Module._gdspx_new_vec2;
    gdspxNewVec3 = Module._gdspx_new_vec3;
    gdspxNewVec4 = Module._gdspx_new_vec4;
    gdspxToGdArray = Module._gdspx_to_gd_array;
    gdspxToGdArrayRaw = Module._gdspx_to_gd_array_raw;
    gdspxToJsArray = Module._gdspx_to_js_array;
    gdspxFunctionPointerModule = Module;
}

let gdspxHeapDataViewBuffer = null;
let gdspxHeapDataView = null;

function GetHeapDataView() {
    const memoryBuffer = Module.HEAPU8.buffer;
    if (gdspxHeapDataViewBuffer !== memoryBuffer) {
        gdspxHeapDataViewBuffer = memoryBuffer;
        gdspxHeapDataView = new DataView(memoryBuffer);
    }
    return gdspxHeapDataView;
}

// Bool-related functions
function ToGdBool(value) {
    EnsureGdspxFunctionPointers();
    return gdspxNewBool(value);
}

function ToJsBool(ptr) {
    const HEAPU8 = Module.HEAPU8;
    const boolValue = HEAPU8[ptr];
    return boolValue !== 0;
}

function AllocGdBool() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocBool();
}

function PrintGdBool(ptr) {
    console.log(ToJsBool(ptr));
}

function FreeGdBool(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeBool(ptr);
}

function ToGdObject(object) {
    return ToGdObj(object);
}
function ToJsObject(ptr) {
    return ToJsObj(ptr);
}
function FreeGdObject(ptr) {
    FreeGdObj(ptr);
}
function AllocGdObject() {
    return AllocGdObj();
}
function PrintGdObject(ptr) {
    PrintGdObj(ptr);
}

function ToGdObj(value) {
    EnsureGdspxFunctionPointers();
    return gdspxNewObj(value.high, value.low);
}

function ToJsObj(ptr) {
    const dataView = GetHeapDataView();
    const low = dataView.getUint32(ptr, true);
    const high = dataView.getUint32(ptr + 4, true);
    return {
        low: low,
        high: high
    };
}

function ToJsBigObj(ptr) {
    return ToJsBigInt(ptr);
}

function AllocGdObj() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocObj();
}

function PrintGdObj(ptr) {
    console.log(ToJsObj(ptr));
}

function FreeGdObj(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeObj(ptr);
}

function ToGdInt(value) {
    EnsureGdspxFunctionPointers();
    return gdspxNewInt(value.high, value.low);
}

function ToJsInt(ptr) {
    const dataView = GetHeapDataView();
    const low = dataView.getUint32(ptr, true);  // 低32位
    const high = dataView.getUint32(ptr + 4, true);  // 高32位
    return {
        low: low,
        high: high
    };
}

function ToJsBigInt(ptr) {
    const dataView = GetHeapDataView();
    if (GDSPX_HAS_BIG_INT64) {
        return dataView.getBigInt64(ptr, true);
    }
    const low = dataView.getUint32(ptr, true);
    const high = dataView.getUint32(ptr + 4, true);
    return BigInt.asIntN(64, (BigInt(high) << 32n) | BigInt(low));
}

function AllocGdInt() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocInt();
}

function PrintGdInt(ptr) {
    console.log(ToJsInt(ptr));
}

function FreeGdInt(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeInt(ptr);
}

function ToGdFloat(value) {
    EnsureGdspxFunctionPointers();
    return gdspxNewFloat(value);
}

function ToJsFloat(ptr) {
    const HEAPF32 = Module.HEAPF32;
    const floatIndex = ptr / 4;
    const floatValue = HEAPF32[floatIndex];
    return floatValue;
}

function AllocGdFloat() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocFloat();
}

function PrintGdFloat(ptr) {
    console.log(ToJsFloat(ptr));
}

function FreeGdFloat(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeFloat(ptr);
}

function ToGdString(str) {
    EnsureGdspxFunctionPointers();
    const stringBytes = GDSPX_UTF8_ENCODER.encode(str);
    const ptr = gdspxMalloc(stringBytes.length + 1);
    Module.HEAPU8.set(stringBytes, ptr);
    Module.HEAPU8[ptr + stringBytes.length] = 0;
    const gdstrPtr = gdspxNewString(ptr, stringBytes.length);
    gdspxFree(ptr);
    return gdstrPtr;
}

function ToJsString(gdstrPtr) {
    return toJsString(gdstrPtr, false);
}

function toJsString(gdstrPtr, isFree) {
    EnsureGdspxFunctionPointers();
    const length = gdspxGetStringLen(gdstrPtr);
    const ptr = gdspxGetString(gdstrPtr);
    const stringBytes = Module.HEAPU8.subarray(ptr, ptr + length);
    const result = GDSPX_UTF8_DECODER.decode(stringBytes);
    if (isFree) {
        gdspxFreeCstr(ptr);
    }
    return result;
}

function AllocGdString() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocString();
}

function PrintGdString(gdstrPtr) {
    console.log(toJsString(gdstrPtr, false));
}

function FreeGdString(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeString(ptr);
}

function ToGdVec2(vec) {
    EnsureGdspxFunctionPointers();
    return gdspxNewVec2(vec.x, vec.y);
}

function ToJsVec2(ptr) {
    const HEAPF32 = Module.HEAPF32;
    const floatIndex = ptr / 4;
    return {
        x: HEAPF32[floatIndex],
        y: HEAPF32[floatIndex + 1]
    };
}

function AllocGdVec2() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocVec2();
}

function PrintGdVec2(ptr) {
    console.log(ToJsVec2(ptr));
}

function FreeGdVec2(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeVec2(ptr);
}

function ToGdVec3(vec) {
    EnsureGdspxFunctionPointers();
    return gdspxNewVec3(vec.x, vec.y, vec.z);
}

function ToJsVec3(ptr) {
    const HEAPF32 = Module.HEAPF32;
    const floatIndex = ptr / 4;
    return {
        x: HEAPF32[floatIndex],
        y: HEAPF32[floatIndex + 1],
        z: HEAPF32[floatIndex + 2]
    };
}

function AllocGdVec3() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocVec3();
}

function PrintGdVec3(ptr) {
    const vec3 = ToJsVec3(ptr);
    console.log(`Vec3(${vec3.x}, ${vec3.y}, ${vec3.z})`);
}

function FreeGdVec3(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeVec3(ptr);
}

function ToGdVec4(vec) {
    EnsureGdspxFunctionPointers();
    return gdspxNewVec4(vec.x, vec.y, vec.z, vec.w);
}

function ToJsVec4(ptr) {
    const HEAPF32 = Module.HEAPF32;
    const floatIndex = ptr / 4;
    return {
        x: HEAPF32[floatIndex],
        y: HEAPF32[floatIndex + 1],
        z: HEAPF32[floatIndex + 2],
        w: HEAPF32[floatIndex + 3]
    };
}

function AllocGdVec4() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocVec4();
}

function PrintGdVec4(ptr) {
    const vec4 = ToJsVec4(ptr);
    console.log(`Vec4(${vec4.x}, ${vec4.y}, ${vec4.z}, ${vec4.w})`);
}

function FreeGdVec4(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeVec4(ptr);
}

function ToGdColor(color) {
    EnsureGdspxFunctionPointers();
    return gdspxNewColor(color.r, color.g, color.b, color.a);
}

function ToJsColor(ptr) {
    const HEAPF32 = Module.HEAPF32;
    const floatIndex = ptr / 4;
    return {
        r: HEAPF32[floatIndex],
        g: HEAPF32[floatIndex + 1],
        b: HEAPF32[floatIndex + 2],
        a: HEAPF32[floatIndex + 3]
    };
}

function AllocGdColor() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocColor();
}

function PrintGdColor(ptr) {
    const color = ToJsColor(ptr);
    console.log(`Color(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
}

function FreeGdColor(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeColor(ptr);
}

function ToGdRect2(rect) {
    EnsureGdspxFunctionPointers();
    return gdspxNewRect2(rect.position.x, rect.position.y, rect.size.x, rect.size.y);
}

function ToJsRect2(ptr) {
    const HEAPF32 = Module.HEAPF32;
    const floatIndex = ptr / 4;
    return {
        position: {
            x: HEAPF32[floatIndex],
            y: HEAPF32[floatIndex + 1]
        },
        size: {
            x: HEAPF32[floatIndex + 2],
            y: HEAPF32[floatIndex + 3]
        }
    };
}

function AllocGdRect2() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocRect2();
}

function PrintGdRect2(ptr) {
    const rect = ToJsRect2(ptr);
    console.log(`Rect2(position: (${rect.position.x}, ${rect.position.y}), size: (${rect.size.width}, ${rect.size.height}))`);
}

function FreeGdRect2(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeRect2(ptr);
}

const gdArrayScratchByType = new Map();

function getGdArrayScratch(arrayType, minSize) {
    EnsureGdspxFunctionPointers();
    let scratch = gdArrayScratchByType.get(arrayType);
    if (!scratch) {
        scratch = { ptr: 0, capacity: 0 };
        gdArrayScratchByType.set(arrayType, scratch);
    }
    if (minSize > scratch.capacity) {
        if (scratch.ptr !== 0) {
            gdspxFree(scratch.ptr);
        }
        scratch.ptr = minSize > 0 ? gdspxMalloc(minSize) : 0;
        scratch.capacity = minSize;
    }
    return scratch;
}

function CopyFastArrayToWasm(array) {
    const data = array.data;
    const dataSize = data.length;
    const scratch = getGdArrayScratch(array.type, dataSize);
    if (dataSize > 0) {
        Module.HEAPU8.set(data, scratch.ptr);
    }
    return scratch.ptr;
}

function ToGdArray(array) {
    EnsureGdspxFunctionPointers();
    if (!array) {
        throw new Error('Invalid array structure. Expected {type, count, data}');
    }
    if (array.__gdspx_fast_array === true) {
        const dataPtr = CopyFastArrayToWasm(array);
        return gdspxToGdArrayRaw(dataPtr, array.data.length, array.count, array.type);
    }
    const dataSize = array.length;
    const dataPtr = gdspxMalloc(dataSize);
    try {
        if (dataSize > 0) {
            Module.HEAPU8.set(array, dataPtr);
        }
        const gdArrayPtr = gdspxToGdArray(dataPtr, dataSize);
        return gdArrayPtr;
    } finally {
        gdspxFree(dataPtr);
    }
}

function ToJsArray(gdArrayPtr) {
    EnsureGdspxFunctionPointers();
    if (!gdArrayPtr) {
        return null;
    }
    const outputSizePtr = gdspxMalloc(4);
    try {
        const serializedPtr = gdspxToJsArray(gdArrayPtr, outputSizePtr);
        if (!serializedPtr) {
            return null;
        }
        const outputSize = Module.HEAP32[outputSizePtr >> 2];
        const data = new Uint8Array(outputSize);
        data.set(Module.HEAPU8.subarray(serializedPtr, serializedPtr + outputSize));
        gdspxFree(serializedPtr);
        return data;
    } finally {
        gdspxFree(outputSizePtr);
    }
}

function AllocGdArray() {
    EnsureGdspxFunctionPointers();
    return gdspxAllocArray();
}

function PrintGdArray(ptr) {
    const val = ToJsArray(ptr);
    console.log(`Array: ${val}`);
}

function FreeGdArray(ptr) {
    EnsureGdspxFunctionPointers();
    gdspxFreeArray(ptr);
}
