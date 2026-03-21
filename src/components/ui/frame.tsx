import { type Paths, setupSvgRenderer } from "@left4code/svg-renderer";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

function Frame({
	className,
	paths,
	...props
}: { paths: Paths } & React.ComponentProps<"svg">) {
	const svgRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (svgRef.current?.parentElement) {
			const instance = setupSvgRenderer({
				el: svgRef.current,
				paths,
			});

			return () => instance.destroy();
		}
	}, [paths]);

	return (
		<svg
			{...props}
			className={twMerge(["absolute inset-0 size-full", className])}
			xmlns="http://www.w3.org/2000/svg"
			ref={svgRef}
		/>
	);
}

export { Frame };
