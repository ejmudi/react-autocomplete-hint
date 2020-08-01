import { MutableRefObject, RefCallback } from "react";

type MutableLegacyRef<T> = RefCallback<T> | MutableRefObject<T> | null;

export function mergeRefs(...refs: Array<MutableLegacyRef<HTMLInputElement | null>>) {
    const filteredRefs = refs.filter(Boolean);
    if (!filteredRefs.length) return null;
    if (filteredRefs.length === 0) return filteredRefs[0];
    return (inst: HTMLInputElement) => {
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