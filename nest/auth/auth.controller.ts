import {
	Body,
	Controller,
	Get,
	HttpCode,
	Logger,
	Post,
	Query,
	Redirect,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenService } from './refresh-token.service'

@Controller()
export class AuthController {
	private readonly logger = new Logger(AuthController.name)

	constructor(
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Recaptcha()
	@Post('auth/login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		this.logger.log(`Login attempt for email: ${dto.email}`)

		try {
			const { refreshToken, ...response } = await this.authService.login(dto)
			this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
			this.logger.log(`Login successful for email: ${dto.email}`)
			return response
		} catch (error) {
			this.logger.error(`Login failed for email: ${dto.email}`, error.stack)
			throw error
		}
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Recaptcha()
	@Post('auth/register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		this.logger.log(`Registration attempt for email: ${dto.email}`)

		try {
			const { refreshToken, ...response } = await this.authService.register(dto)
			this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
			this.logger.log(`Registration successful for email: ${dto.email}`)
			return response
		} catch (error) {
			this.logger.error(
				`Registration failed for email: ${dto.email}`,
				error.stack
			)
			throw error
		}
	}

	@Get('verify-email')
	@Redirect('http://localhost:3000/verified', 302)
	async verifyEmail(@Query('token') token?: string) {
		this.logger.log(`Email verification attempt with token: ${token}`)

		if (!token) {
			this.logger.warn('Email verification failed: token not provided')
			throw new UnauthorizedException('Token not passed')
		}

		return this.authService.verifyEmail(token)
	}

	@HttpCode(200)
	@Post('auth/access-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME]
		this.logger.log(`Access token refresh attempt`)

		if (!refreshTokenFromCookies) {
			this.logger.warn('Refresh token not passed in cookies')
			this.refreshTokenService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
		this.logger.log(`Access token refreshed successfully`)
		return response
	}

	@HttpCode(200)
	@Post('auth/logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.logger.log(`Logout attempt`)
		this.refreshTokenService.removeRefreshTokenFromResponse(res)
		this.logger.log(`Logout successful`)
		return true
	}
}
