export type ProjectRecord = {
  demo_url: string | null
  description: string | null
  display_demo: boolean
  display_order: number | null
  fork: boolean
  forks: number | null
  github_owner: string
  github_repo: string
  github_repo_id: number
  github_url: string | null
  has_pages: boolean
  id: number
  is_visible: boolean
  languages: Record<string, number> | null
  primary_language: string | null
  pushed_at: string | null
  readme: string | null
  stars: number | null
  topics: string[] | null
}
