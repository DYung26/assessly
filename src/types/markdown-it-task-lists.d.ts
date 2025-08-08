declare module 'markdown-it-task-lists' {
  import { PluginWithOptions } from 'markdown-it';
  const markdownItTaskLists: PluginWithOptions<{
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }>;
  export default markdownItTaskLists;
}
