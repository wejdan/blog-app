import { useCallback, useEffect, useRef, useState } from "react";

export function useObserverRef(callback) {
  const [node, setNode] = useState(null);

  // Callback ref, to update `node` state when the ref changes
  const ref = useCallback(
    (newNode) => {
      if (newNode !== null) {
        setNode(newNode);
        callback(newNode);
      }
    },
    [callback]
  );

  return [ref, node];
}
