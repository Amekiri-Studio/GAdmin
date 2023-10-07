#!/usr/bin/env node

const { Command } = require('commander');
const { spawn, fork } = require('child_process');

const pino = require('pino');
const scan_cli = require("./cli/scan");
const search_cli = require('./cli/search');
const list_cli = require("./cli/list");
const start_cli = require("./cli/start");
const modify_cli = require("./cli/modify");
const remove_cli = require("./cli/remove");

// 创建一个 Commander.js 命令对象
const program = new Command();

// 设置命令的版本号
program.version('1.0.0');

program
	.command('list')
	.description("列出所有游戏")
	.option("-a, --all", "所有已经被管理的游戏")
	.option("-b, --begin <value>", "数据库开始的地方")
	.option("-l, --limit <value>", "数据长度")
	.option("-j, --json", "使用JSON进行数据输出")
	.action((options) => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
		}
		else {
			if (options.all) {
				list_cli.listAllGame({json: options.json});
			} else {
				let begin = options.begin;
				let limit = options.limit;

				if (!begin || !limit) {
					console.error("错误：必须同时存在begin和limit参数");
					console.log("请加上--help查看详情");
				} else {
					list_cli.listGameByRange(parseInt(limit), parseInt(begin), {json:options.json});
				}
			}
		}
	});


program
	.command('scan')
	.description('自动扫描指定目录的游戏')
	.option("-p, --path <value>", "欲扫描的路径")
	.option("-s, --single", "若该目录只包含一个游戏，请添加该选项")
	.action(options => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
		}
		else {
			if (options.path) {
				if (options.single) {
					scan_cli.scanSingleGame(options.path);
				}
				else {
					scan_cli.scanGameDefault(options.path);
				}
				
			}
			else {
				console.error("未指定路径，请加上--help查看使用方法");
			}
		}
	})

program
	.command('check')
	.description('检查游戏是否已经入库')
	.option("-p, --path <value>", "游戏路径。如果没有提供则检查当前路径")
	.option("-u, --upper", "自动检查该路径下的游戏")
	.action(options => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
		} else {

		}
	})

program
	.command('search')
	.description('通过关键字搜索游戏')
	.option('-k, --keyword <value>', "游戏名称关键字")
	.option('-j, --json', "使用JSON进行数据输出")
	.action(options => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
		} else {
			search_cli.searchGame(options.keyword, {json:options.json})
		}
	})

program
	.command('modify')
	.description('修改游戏基本信息（包括游戏名称、路径、可执行文件、类型、环境变量、参数等）')
	.option("-n, --name <value>", "游戏名称")
	.option("-i, --id <value>", "游戏ID")
	.option("-t, --type <value>", "参数类型(name, path, exec_file, type, env, params)")
	.option("-v, --value <value>", "值")
	.action(options => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
			return;
		}
		if (options.id) {
			modify_cli.modifyInfo(options.id, options.type, options.value);
		} else {
			modify_cli.modifyInfo(options.name, options.type, options.value);
		}
	})

program
	.command("start")
	.description("启动游戏！")
	.option("-i, --id <value>", "游戏ID")
	.option("-n, --name <value>", "游戏名称")
	.option("-e, --env <value>", "设置环境变量(加上--replace-env覆盖库的环境变量)")
	.option("-p, --params <value>", "设置启动参数(加上--replace-params覆盖库的参数)")
	.option("--replace-env", "覆盖库配置的环境变量")
	.option("--replace-params", "覆盖库配置的参数")
	.action(options => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
		} else {
			// console.log(options);
			if (options.id) {
				start_cli.processStartGame(parseInt(options.id), options.env, options.params, options.replaceEnv, options.replaceParams);
			} else {
				start_cli.processStartGame(options.name, options.env, options.params, options.replaceEnv, options.replaceParams);
			}
		}
	})

program
	.command("remove")
	.description("将游戏从GAdmin游戏库移除")
	.option("-i, --id <value>", "欲删除的游戏ID")
	.option("-n, --name <value>", "欲删除的游戏名称")
	.action(options => {
		if (JSON.stringify(options) === "{}") {
			console.error("没有提供任何参数，请加上--help查看使用方法");
		} else {
			if (options.id) {
				remove_cli.removeGame({id: options.id});
			} else {
				remove_cli.removeGame({name: options.name});
			}
		}
	})
// 解析命令行参数
program.parse(process.argv);