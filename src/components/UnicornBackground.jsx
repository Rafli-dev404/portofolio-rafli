import UnicornScene from 'unicornstudio-react'

export default function UnicornBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
      <UnicornScene
        projectId="eIiNIgk4kED0pYFEs3qn"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
      />
    </div>
  )
}