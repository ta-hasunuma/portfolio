import {
	Building2,
	Code,
	Container,
	GraduationCap,
	Pause,
	Play,
	School,
	Server,
	Volume2,
	VolumeX,
	Wrench,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	AccordionContent,
	AccordionItem,
	AccordionRoot,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Frame } from "@/components/ui/frame";
import {
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from "@/components/ui/tabs";

const sectionFramePath =
	'[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","15","0"],["L","100% - 0","0"],["L","100% - 0","100% - 7"],["L","0% + 0","100% - 7"],["L","0% + 0","0% + 15"],["L","15","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","7","100% - 7"],["L","100% - 8","100% - 7"],["L","100% - 14","100% + 0"],["L","12","100% + 0"],["L","7","100% - 7"]]}]';

function MusicPlayer({
	isPlaying,
	onTogglePlay,
}: { isPlaying: boolean; onTogglePlay: () => void }) {
	const [isMuted, setIsMuted] = useState(false);
	const [progress, setProgress] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (isPlaying) {
			audio.play();
		} else {
			audio.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const handleTimeUpdate = () => {
			if (audio.duration) {
				setProgress(audio.currentTime / audio.duration);
			}
		};
		const handleEnded = () => {
			onTogglePlay();
			setProgress(0);
		};
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("ended", handleEnded);
		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [onTogglePlay]);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => {
			if (audioRef.current) {
				audioRef.current.muted = !prev;
			}
			return !prev;
		});
	}, []);

	return (
		<div
			className={[
				"relative flex items-center gap-3 px-4 py-2 pb-4",
				"[--color-frame-1-stroke:var(--color-primary)]",
				"[--color-frame-1-fill:var(--color-primary)]/15",
				"[--color-frame-2-stroke:var(--color-primary)]",
				"[--color-frame-2-fill:transparent]",
			].join(" ")}
		>
			<audio ref={audioRef} src="/music.mp3" preload="metadata" loop />
			<Frame paths={JSON.parse(sectionFramePath)} />
			<button
				type="button"
				onClick={onTogglePlay}
				className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary text-background transition-all hover:drop-shadow-[0_0_10px_var(--color-primary)] cursor-pointer"
			>
				{isPlaying ? (
					<Pause className="size-3.5" />
				) : (
					<Play className="size-3.5 ml-0.5" />
				)}
			</button>
			<div className="relative z-10 flex flex-col gap-0.5">
				<span className="text-xs font-bold tracking-widest">Neon Horizon</span>
				<span className="text-xs font-roboto text-foreground/50">
					Synthwave Ambient
				</span>
				<div className="mt-1 h-0.5 w-24 rounded bg-foreground/10">
					<div
						className="h-full rounded bg-primary transition-[width] duration-300"
						style={{ width: `${progress * 100}%` }}
					/>
				</div>
			</div>
			<button
				type="button"
				onClick={toggleMute}
				className="relative z-10 flex size-6 items-center justify-center text-foreground/50 hover:text-primary transition-colors cursor-pointer"
			>
				{isMuted ? (
					<VolumeX className="size-3.5" />
				) : (
					<Volume2 className="size-3.5" />
				)}
			</button>
		</div>
	);
}

function SectionHeader({ label, title }: { label: string; title: string }) {
	return (
		<div className="flex flex-col items-center gap-3">
			<span className="text-xs font-bold tracking-[0.25em] text-primary">
				{label}
			</span>
			<h2 className="text-3xl font-bold tracking-wider">{title}</h2>
			<div className="h-0.5 w-12 bg-primary" />
		</div>
	);
}

function SkillCard({
	icon: Icon,
	title,
	skills,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	skills: string[];
}) {
	return (
		<div
			className={[
				"relative flex flex-col items-center gap-4 px-8 py-8 pb-10 flex-1 min-w-[200px]",
				"[--color-frame-1-stroke:var(--color-primary)]",
				"[--color-frame-1-fill:var(--color-primary)]/15",
				"[--color-frame-2-stroke:var(--color-primary)]",
				"[--color-frame-2-fill:transparent]",
			].join(" ")}
		>
			<Frame paths={JSON.parse(sectionFramePath)} />
			<div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-primary/10">
				<Icon className="size-6 text-primary" />
			</div>
			<h3 className="relative z-10 text-base font-bold tracking-widest">
				{title}
			</h3>
			<ul className="relative z-10 flex flex-col items-center gap-1 font-roboto text-sm text-foreground/70">
				{skills.map((skill) => (
					<li key={skill}>{skill}</li>
				))}
			</ul>
		</div>
	);
}

function App() {
	const [isPlaying, setIsPlaying] = useState(false);
	const togglePlay = useCallback(() => {
		setIsPlaying((prev) => !prev);
	}, []);

	return (
		<div
			className="flex min-h-svh flex-col transition-[--color-primary] duration-500"
			style={{
				"--color-primary": isPlaying
					? "rgb(20, 160, 230)"
					: "rgb(100, 130, 160)",
			} as React.CSSProperties}
		>
			{/* Navigation */}
			<nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-background/80 border-b border-foreground/5">
				<span className="text-xl font-bold tracking-[0.2em] text-primary">
					PORTFOLIO
				</span>
				<div className="flex items-center gap-6">
					<a
						href="#about"
						className="text-xs tracking-widest text-foreground/60 hover:text-primary transition-colors"
					>
						ABOUT
					</a>
					<a
						href="#skills"
						className="text-xs tracking-widest text-foreground/60 hover:text-primary transition-colors"
					>
						SKILLS
					</a>
					<a
						href="#career"
						className="text-xs tracking-widest text-foreground/60 hover:text-primary transition-colors"
					>
						CAREER
					</a>
					<MusicPlayer isPlaying={isPlaying} onTogglePlay={togglePlay} />
				</div>
			</nav>

			{/* Hero Section */}
			<section className="flex min-h-[80vh] items-center justify-between gap-12 px-16 py-24">
				<div className="flex max-w-xl flex-col gap-6">
					<span className="text-xs font-bold tracking-[0.3em] text-primary">
						FULL-STACK DEVELOPER
					</span>
					<h1 className="text-6xl font-bold leading-tight">
						Hello, I&apos;m
						<br />
						<span className="text-primary">Hasunuma</span>
					</h1>
					<p className="font-roboto text-base leading-relaxed text-foreground/60">
						モダンなWeb技術を駆使して、
						<br />
						ユーザー体験を追求するエンジニア。
						<br />
						React / TypeScript / Node.js
					</p>
					<div className="flex gap-4 pt-2">
						<Button variant="default">VIEW SKILLS</Button>
						<Button variant="secondary">CONTACT ME</Button>
					</div>
				</div>
				<div
					className={[
						"relative hidden w-[480px] h-[480px] lg:block",
						"[--color-frame-1-stroke:var(--color-primary)]",
						"[--color-frame-1-fill:var(--color-primary)]/8",
						"[--color-frame-2-stroke:var(--color-primary)]",
						"[--color-frame-2-fill:transparent]",
					].join(" ")}
				>
					<Frame
						clipPathId="hero-clip"
						clipPathInset={16}
						paths={JSON.parse(
							'[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","19","0"],["L","100% - 18","0"],["L","100% + 0","0% + 18.5"],["L","100% + 0","50% - 21.119592875318066%"],["L","100% - 8","50% - 19.338422391857506%"],["L","100% - 8","50% + 17.557251908396946%"],["L","100% + 0","100% - 30.15267175572519%"],["L","100% + 0","100% - 22.5"],["L","100% - 17","100% - 7.5"],["L","50% + 17.16417910447761%","100% - 7.5"],["L","50% + 15.298507462686567%","100% - 15.5"],["L","50% - 14.552238805970148%","100% - 15.5"],["L","50% - 16.417910447761194%","100% - 6.5"],["L","0% + 17","100% - 7.5"],["L","0% + 0","100% - 24.5"],["L","0% + 0","50% + 19.84732824427481%"],["L","0% + 9","50% + 17.557251908396946%"],["L","0% + 10","50% - 18.829516539440203%"],["L","0","50% - 21.62849872773537%"],["L","0","0% + 19.5"],["L","19","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","28","100% - 7.000000000000057"],["L","50% - 16.417910447761194%","100% - 7"],["L","50% - 14.552238805970148%","100% - 15.5"],["L","50% + 15.298507462686567%","100% - 15.5"],["L","50% + 17.16417910447761%","100% - 7.5"],["L","100% - 26","100% - 7.5"],["L","100% - 33","100% + 0"],["L","50% + 16.23134328358209%","100% - 1.1368683772161605"],["L","50% + 14.552238805970148%","100% - 8"],["L","50% - 13.619402985074627%","100% - 8"],["L","50% - 15.111940298507463%","100% + 0"],["L","33","100% + 0"],["L","28","100% - 7"]]}]',
						)}
					/>
					<img
						src="/image.png"
						alt="Hasunuma"
						className="absolute inset-0 z-10 h-full w-full object-cover"
						style={{ clipPath: "url(#hero-clip)" }}
					/>
				</div>
			</section>

			{/* About Section */}
			<section
				id="about"
				className="flex flex-col items-center gap-12 px-16 py-24"
			>
				<SectionHeader label="ABOUT ME" title="自己紹介" />
				<div className="flex max-w-4xl flex-col gap-6 font-roboto text-base leading-loose text-foreground/70 lg:flex-row lg:gap-12">
					<div
						className={[
							"relative hidden w-[320px] h-[320px] shrink-0 lg:block",
							"[--color-frame-1-stroke:var(--color-primary)]",
							"[--color-frame-1-fill:var(--color-primary)]/10",
							"[--color-frame-2-stroke:var(--color-primary)]",
							"[--color-frame-2-fill:transparent]",
						].join(" ")}
					>
						<Frame paths={JSON.parse(sectionFramePath)} clipPathId="about-clip" clipPathInset={12} />
						<img
							src="/image.png"
							alt="自己紹介"
							className="absolute inset-0 z-10 h-full w-full object-cover"
							style={{ clipPath: "url(#about-clip)" }}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<p>
							Webアプリケーション開発を専門とするフルスタックエンジニアです。フロントエンドからバックエンドまで幅広い技術スタックを持ち、ユーザー中心のプロダクト開発を行っています。
						</p>
						<p>
							最新の技術トレンドを取り入れながら、パフォーマンスとアクセシビリティを重視した開発を心がけています。チームでの協働も大切にしており、コードレビューや技術共有を積極的に行います。
						</p>
					</div>
				</div>
			</section>

			{/* Skills Section */}
			<section
				id="skills"
				className="flex flex-col items-center gap-12 px-16 py-24"
			>
				<SectionHeader label="SKILLS" title="技術スタック" />
				<TabsRoot defaultValue="overview" className="w-full max-w-5xl">
					<TabsList>
						<TabsTrigger value="overview">OVERVIEW</TabsTrigger>
						<TabsTrigger value="frontend">FRONTEND</TabsTrigger>
						<TabsTrigger value="backend">BACKEND</TabsTrigger>
						<TabsTrigger value="devops">DEVOPS</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<div className="flex flex-wrap gap-6">
							<SkillCard
								icon={Code}
								title="FRONTEND"
								skills={[
									"React / Next.js",
									"TypeScript",
									"Tailwind CSS",
									"HTML / CSS",
								]}
							/>
							<SkillCard
								icon={Server}
								title="BACKEND"
								skills={[
									"Node.js / Express",
									"Python / FastAPI",
									"PostgreSQL",
									"REST API / GraphQL",
								]}
							/>
							<SkillCard
								icon={Container}
								title="DEVOPS"
								skills={[
									"Docker / K8s",
									"GitHub Actions",
									"AWS / GCP",
									"CI/CD",
								]}
							/>
							<SkillCard
								icon={Wrench}
								title="TOOLS"
								skills={["Git / GitHub", "VS Code", "Figma", "Vite / Webpack"]}
							/>
						</div>
					</TabsContent>
					<TabsContent value="frontend">
						<div className="flex flex-col gap-3 font-roboto text-foreground/80">
							<p>
								Reactを中心としたモダンフロントエンド開発を得意としています。
							</p>
							<ul className="list-inside list-disc space-y-1 text-foreground/60">
								<li>React 19 / Next.js App Router でのSPA・SSR開発</li>
								<li>TypeScript による型安全な開発</li>
								<li>Tailwind CSS / CSS Modules によるスタイリング</li>
								<li>アクセシビリティ (a11y) を考慮したUI設計</li>
								<li>パフォーマンス最適化 (Core Web Vitals)</li>
							</ul>
						</div>
					</TabsContent>
					<TabsContent value="backend">
						<div className="flex flex-col gap-3 font-roboto text-foreground/80">
							<p>サーバーサイド開発とデータベース設計を担当しています。</p>
							<ul className="list-inside list-disc space-y-1 text-foreground/60">
								<li>Node.js / Express による REST API 設計・実装</li>
								<li>Python / FastAPI による高速APIサーバー構築</li>
								<li>PostgreSQL / Redis を用いたデータ永続化</li>
								<li>GraphQL スキーマ設計とリゾルバ実装</li>
								<li>認証・認可 (JWT, OAuth) の実装経験</li>
							</ul>
						</div>
					</TabsContent>
					<TabsContent value="devops">
						<div className="flex flex-col gap-3 font-roboto text-foreground/80">
							<p>インフラ構築とCI/CDパイプラインの整備を行っています。</p>
							<ul className="list-inside list-disc space-y-1 text-foreground/60">
								<li>Docker によるコンテナ化とKubernetes運用</li>
								<li>GitHub Actions でのCI/CDパイプライン構築</li>
								<li>AWS (ECS, Lambda, S3) / GCP の活用</li>
								<li>Terraform / IaC によるインフラコード管理</li>
								<li>モニタリングとアラート設定</li>
							</ul>
						</div>
					</TabsContent>
				</TabsRoot>
			</section>

			{/* Career Section */}
			<section
				id="career"
				className="flex flex-col items-center gap-12 px-16 py-24"
			>
				<SectionHeader label="CAREER" title="経歴" />
				<AccordionRoot defaultValue={["company"]} className="w-full max-w-3xl">
					<AccordionItem value="highschool">
						<AccordionTrigger>
							<School className="size-4 me-2 text-primary" />
							<span className="flex-1 text-left">○○高等学校 理数科</span>
							<span className="ms-auto me-4 text-xs text-primary/70 font-normal">
								2019 - 2022
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="font-roboto text-sm leading-relaxed">
								<p>理数科に在籍し、プログラミングと数学を中心に学習。</p>
								<p className="mt-2">
									情報技術の基礎を習得し、課題研究ではWebアプリケーションの開発に取り組む。文化祭でのデジタル作品展示や、プログラミングコンテストへの参加を通じて実践力を養う。
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="university">
						<AccordionTrigger>
							<GraduationCap className="size-4 me-2 text-primary" />
							<span className="flex-1 text-left">○○大学 情報工学部</span>
							<span className="ms-auto me-4 text-xs text-primary/70 font-normal">
								2022 - 2026
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="font-roboto text-sm leading-relaxed">
								<p>
									情報工学を専攻し、ソフトウェア工学・機械学習・データベース設計を深く学ぶ。
								</p>
								<p className="mt-2">
									研究室ではWebパフォーマンス最適化に関する研究に従事。ハッカソンやOSSコントリビューションを通じて、チーム開発の経験を積む。
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="company">
						<AccordionTrigger>
							<Building2 className="size-4 me-2 text-accent" />
							<span className="flex-1 text-left">○○株式会社 エンジニア</span>
							<span className="ms-auto me-4 flex items-center gap-2">
								<span className="text-xs text-primary/70 font-normal">
									2026 -
								</span>
								<span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold tracking-widest text-accent-foreground">
									NOW
								</span>
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="font-roboto text-sm leading-relaxed">
								<p>新卒入社し、Webアプリケーション開発チームに所属。</p>
								<p className="mt-2">
									React / TypeScript を用いたフロントエンド開発と、Node.js
									によるAPI設計・実装を担当。アジャイル開発プロセスの中で、コードレビューやCI/CD整備にも積極的に取り組んでいる。
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>
				</AccordionRoot>
			</section>

			{/* Footer */}
			<footer className="mt-auto flex flex-col items-center gap-6 border-t border-foreground/5 px-16 py-8">
				<div className="flex w-full items-center justify-between">
					<span className="text-lg font-bold tracking-[0.2em] text-primary">
						PORTFOLIO
					</span>
					<div className="flex gap-8 font-roboto text-sm text-foreground/50">
						<p className="hover:text-primary transition-colors">
							GitHub
						</p>
						<p className="hover:text-primary transition-colors">
							Twitter
						</p>
						<p className="hover:text-primary transition-colors">
							LinkedIn
						</p>
					</div>
				</div>
				<span className="text-xs font-roboto text-foreground/30">
					© 2026 Hasunuma. All rights reserved.
				</span>
			</footer>
		</div>
	);
}

export default App;
