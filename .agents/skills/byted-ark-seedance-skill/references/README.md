# byted-ark-seedance-skill v5.0.0

AgentPlan Seedance 视频生成、编辑、延长与任务查询工具。入口及安全边界见根目录SKILL.md；2.5参数限制见 references/seedance-2.5.md。

运行环境：Node.js 18+，无第三方npm依赖。`npm test`运行本地回归测试，不提交生成请求。

模型入口使用AgentPlan服务，2.5模型名为doubao-seedance-2.5。仅在服务端开放后可真实使用；UnsupportedModel不应通过切换到后付费接口规避。

优先通过本地ARK_API_KEY环境变量配置凭据。默认不保存临时密钥；用户明确要求保存时才使用--save-api-key true。上传包不包含任何用户配置、真实密钥、偏好或生成记录。
