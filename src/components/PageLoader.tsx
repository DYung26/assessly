import { ThreeDotLoader } from "./ui/three-dot-loader";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <ThreeDotLoader className="bg-black"/>
    </div>
  );
}
