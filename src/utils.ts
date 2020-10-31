import { MutableRefObject, RefCallback } from "react";

type MutableRef<T> = RefCallback<T> | MutableRefObject<T> | null;

export function mergeRefs(...refs: Array<MutableRef<HTMLElement | null>>) {
    const filteredRefs = refs.filter(Boolean);
    
    return (inst: HTMLElement) => {
        for (let ref of filteredRefs) {
            if (typeof ref === 'function') {
                ref(inst);
            } else if (ref) {
                ref.current = inst;
            }
        }
    };
};

// IE doesn't seem to get the composite computed value (eg: 'padding',
// 'borderStyle', etc.), so generate these from the individual values.
export function interpolateStyle(
    styles: CSSStyleDeclaration,
    attr: string,
    subattr: string = ''
): string {
    // Title-case the sub-attribute.
    if (subattr) {
        subattr = subattr.replace(subattr[0], subattr[0].toUpperCase());
    }

    return ['Top', 'Right', 'Bottom', 'Left']
        // @ts-ignore: (attr + dir + subattr) property cannot be determined at compile time
        .map((dir) => styles[attr + dir + subattr])
        .join(' ');
}

export function sortAsc<T> (a: T, b: T) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}